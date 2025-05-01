import { googleAuth, type GoogleUser } from '@hono/oauth-providers/google';
import type { MiddlewareHandler, Context, Next } from 'hono';
import { TokenManager } from '../redis/token.manager';
import { getCookie } from 'hono/cookie';

export const googleOauth: () => MiddlewareHandler = () => {
  return googleAuth({
    client_id: process.env.GOOGLE_CLIENT_ID,
    scope: ['profile', 'email', 'openid'],
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    prompt: 'consent',
  });
};

export const checkAuth: MiddlewareHandler = async (c: Context, next: Next) => {
  // const user = c.get('user-google');
  // const user = c.get('user-google');
  const authToken = getCookie(c, 'auth_token');
  // const user = JSON.parse(getCookie(c, 'user') as string) as User;
  let user: GoogleUser | undefined | string = getCookie(c, 'user');
  if (user) {
    user = JSON.parse(user as string) as GoogleUser;
  }
  // console.log('This is the user:\n');
  // console.log(user);
  if (!authToken || !user) {
    c.status(401);
    console.log('Unauthorized');
    return c.json({ isAuthenticated: false });
  }

  try {
    const tokens = await TokenManager.getTokens((user as GoogleUser).id as string);
    if (!tokens || tokens.accessToken !== authToken) {
      c.status(401);
      return c.json({ isAuthenticated: false });
    }
    c.set('user-google', user as GoogleUser);
    await next();
  } catch (err) {
    c.status(401);
    return c.json({ isAuthenticated: false });
  }
};
