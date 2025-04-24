import { googleAuth } from '@hono/oauth-providers/google';
import type { MiddlewareHandler, Context, Next } from 'hono';
import { TokenManager } from '../redis/token.manager';

export const googleOauth: () => MiddlewareHandler = () => {
  return googleAuth({
    client_id: process.env.GOOGLE_CLIENT_ID,
    scope: ['profile', 'email', 'openid'],
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
  });
};

export const checkAuth: MiddlewareHandler = async (c: Context, next: Next) => {
  const user = c.get('user-google');
  if (!user) {
    c.status(401);
    console.log('Unauthorized');
    return c.json({ isAuthenticated: false });
  }

  try {
    const tokens = await TokenManager.getTokens(user?.id as string);
    if (!tokens) {
      c.status(401);
      return c.json({ isAuthenticated: false });
    }
    await next();
  } catch (err) {
    c.status(401);
    return c.json({ isAuthenticated: false });
  }
};
