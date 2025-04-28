import type { Context } from 'hono';

export const authChecker: (c: Context) => Promise<Response> = async (c: Context) => {
  const user = c.get('user-google');

  return c.json({ isAuthenticated: true, user: user });
};
