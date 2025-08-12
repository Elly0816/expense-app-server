import type { GoogleUser } from '@hono/oauth-providers/google';
import type { Context } from 'hono';
import runConversation from '../../agent/groq';

const handleChat: (c: Context) => Promise<Response> = async (c) => {
  const startTime = Date.now();
  console.log(`\n\n\n\n\nStarted Parsing the request at ${startTime}`);
  try {
    // Handle the response from the chat
    const body = await c.req.json();
    console.log(`It took ${Date.now() - startTime} to parse the request`);
    console.log('The content of the request body is: ');
    console.log(body);
    const userId = (c.get('user-google') as GoogleUser).id;
    const userName = (c.get('user-google') as GoogleUser).name;
    console.log('Starting the conversation');

    //Sanitize the query of any html tags
    const cleanQuery = (body?.query as string).replace(/(<[^>]*>|\\n)/g, '');
    console.log('This is the cleaned up query: ');
    console.log(cleanQuery);
    const response = await runConversation({
      userId: userId,
      userPrompt: cleanQuery,
      name: userName,
    });
    console.log(`Total processing time took: ${Date.now() - startTime}`);
    c.status(201);
    return c.json({ response: response });
    // return c.json({ response: 'This is the response' });
  } catch (err) {
    c.status(500);
    return c.json({ response: err });
  }

  // c.status()
  // return c.json({})
};

export default handleChat;
