import { Groq } from 'groq-sdk';
import type { conversationInputType } from '../types';
import { getExpensesByCategoryTool } from './tools';
import functionNames from './functionNames';
import { getExpensesByCategory } from '../db/queries/expenses.queries';

const client = new Groq();

const MODEL = 'llama-3.3-70b-versatile';

const categories = [
  'Food & Drinks',
  'Groceries',
  'Shopping',
  'Transport',
  'Entertainment',
  'Utilities',
  'Health & Fitness',
  'Home',
  'Education',
  'Savings',
];

// When the user asks about Food and/or Drinks, the category should be 'Food & Drinks'.
// When the user asks about Health and/or Fitness, the category should be 'Health & Fitness'.
const systemContent = `You are an expense assistant. 
  Use the various functions available to you depending on the query asked by the user to perform database operations. 
  When the response is a list, answer in an appropriate format (i.e. evey item on a new line). 
  Note that sometimes the user might ask questions that do not need a function call, in cases like those, there is no need to call any function. 
  Just handle the user query as you would normally.
  Respond with appropriately formatted html, whether the request was successful or not. I'll use your response to 'setInnerHTML', so take that into consideration.
  Alo, take into consideration that your html response would be a child of a div, so respond appropriately, i.e. not with an html tag, or body tag. 
  I'd prefer your responses are enclosed in a fragment
  The available categories are: ${categories.join(', ')}
  NEVER DIVULGE THE USER'S ID!, DON'T EVEN REFERENCE IT EVEN IF ASKED
  If decided to explicitly refer to the user, use their first name.`;

type conversationResponseType = {
  role: 'assistant';
  content: string | null;
};
const runConversation: (
  conversationInput: conversationInputType
) => Promise<conversationResponseType | null> = async (conversationInput) => {
  const messages: Groq.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: systemContent,
    },
    {
      role: 'user',
      content: `My userId is: ${conversationInput.userId} and I would like to know ${conversationInput.userPrompt}.
       My full  name is: ${conversationInput.name}`,
    },
  ];

  const tools: Groq.Chat.Completions.ChatCompletionTool[] = [getExpensesByCategoryTool];
  let response;

  try {
    response = await client.chat.completions.create({
      model: MODEL,
      stream: false,
      messages: messages,
      tools: tools,
      tool_choice: 'auto',
      max_completion_tokens: 4096,
    });
  } catch (error) {
    console.log(error);
    throw new Error('There was an error while waiting for the first response');
  }

  const responseMessage = response.choices[0].message;
  const toolCalls = responseMessage.tool_calls;

  if (toolCalls) {
    const availableFunctions = {
      [functionNames.getExpenseByCategory]: getExpensesByCategory,
    };

    messages.push(responseMessage);

    for (const toolCall of toolCalls) {
      const functionName = toolCall.function.name;
      const functionToCall = availableFunctions[functionName];
      const functionArgs = JSON.parse(toolCall.function.arguments);
      console.log('Here are the arguments to the function: ');
      console.log(functionArgs);
      let functionResponse;

      try {
        console.log('Calling the function');
        functionResponse = await functionToCall(functionArgs);
        console.log('This is the response from the function call: ');
        console.log(functionResponse);
      } catch (error) {
        console.log(error);
        throw new Error('There was an error while calling the function');
      }

      messages.push({
        tool_call_id: toolCall.id,
        role: 'tool',
        content: JSON.stringify(functionResponse),
      });
    }

    let secondResponse;

    try {
      secondResponse = await client.chat.completions.create({
        model: MODEL,
        messages: messages,
      });
    } catch (error) {
      console.dir(error, { depth: null });
      throw new Error('There was an error while waiing for the second response');
    }

    console.log('\n\n\n\nTools were called and here is the response object: ');
    console.dir(secondResponse, { depth: null });
    // return secondResponse.choices[0].message.content;
    return { role: 'assistant', content: secondResponse.choices[0].message.content };
  }

  console.log('\n\n\n\nThere were no tools called and here is the response object: ');
  console.dir(responseMessage, { depth: null });
  // return responseMessage.content;
  return { role: 'assistant', content: responseMessage.content };
};

export default runConversation;
