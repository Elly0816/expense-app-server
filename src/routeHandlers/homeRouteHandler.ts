import { type Context } from 'hono';
import type { BlankEnv, BlankInput, BlankSchema } from 'hono/types';

export const getHomeRouteHandler: (
  context: Context<BlankEnv, '/', BlankInput>
) => Promise<Response> = async (context) => {
  return context.text('Hello World');
};
