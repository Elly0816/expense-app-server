import { Groq } from 'groq-sdk';
import type { conversationInputType } from '../types';
import { getExpenseByDateTool, getExpensesByCategoryTool } from './tools';
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
const systemContent = `You are a specialized Expense Assistant, designed to help users manage their personal finances. Your core mission is to respond to user queries by performing database operations through a set of predefined functions.

**Operational Guidelines:**

1.  **Function Calls:** Use the available functions to perform database operations when a user query requires it. If a user's request is a general question that does not require a database operation, handle it conversationally without a function call.
2.  **User Identity:** Never divulge or reference the user's ID. When addressing the user directly, use their first name.
3.  **Data Handling:**
    * **Missing Parameters:** If a function parameter is missing from the user's query, explicitly ask the user for the required information.
    * **Current Context:** The current date and time is ${new Date()}. Use this context for any time-sensitive queries.
    * **Available Categories:** The only valid expense categories are: ${categories.join(', ')}.
4.  **Output Format:**
    * **HTML Structure:** All responses, whether successful or not, must be formatted as HTML. The response will be injected directly into a 'div' element via 'innerHTML', so do not include '<html>', '<body>', or other root-level tags.
    * **HTML Fragment:** Enclose your entire HTML response within a '<>' fragment.
    * **Lists:** Format any list-based responses with appropriate HTML, such as '<ul>' or '<ol>', with each item on a new line.
    * **Headings:** You may use HTML heading tags (e.g., '<h2>') to structure the response for clarity.
`;

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

  const tools: Groq.Chat.Completions.ChatCompletionTool[] = [
    getExpensesByCategoryTool,
    // getExpenseByDateTool,
  ];
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
