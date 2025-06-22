import { googleAuth, type GoogleUser } from '@hono/oauth-providers/google';
import type { MiddlewareHandler, Context, Next } from 'hono';
import { TokenManager } from '../redis/token.manager';
import { getCookie } from 'hono/cookie';
import { buildCallbackURL } from '../utils/properURLConstruction';

export const googleOauth: (callbackURL: string) => MiddlewareHandler = (callbackURL) => {
  //console.log('\n\n\nIn the callback');
  //console.log(`client id: ${process.env.GOOGLE_CLIENT_ID}`);
  //console.log(`client secret: ${process.env.GOOGLE_CLIENT_SECRET}\n\n\n`);
  return googleAuth({
    client_id: process.env.GOOGLE_CLIENT_ID,
    scope: ['profile', 'email', 'openid'],
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    prompt: 'consent',
    redirect_uri: callbackURL,
  });
};

export const checkAuth: MiddlewareHandler = async (c: Context, next: Next) => {
  // const user = c.get('user-google');
  let authToken = getCookie(c, 'auth_token');
  // const authToken = c.get('token');
  let user: GoogleUser | undefined | string = getCookie(c, 'user');
  if (user) {
    user = JSON.parse(user as string) as GoogleUser;
  }

  let tokenExpiry = getCookie(c, 'token_expiry');
  // //console.log('This is the user:\n');
  // //console.log(user);

  if (!authToken || !user || !tokenExpiry) {
    // Then check the headers for the values
    const authHeader = c.req.header('Authorization');
    console.log(`This is the auth header in the check Auth middleware`);
    console.log(authHeader);
    if (authHeader && authHeader.startsWith('Bearer')) {
      const newHeader = JSON.parse(authHeader.substring(7).replace('%22', '') as string);
      console.log(`This is the new header in the check Auth middleware`);
      console.log(newHeader);
      const { user: headerUser, auth_token, token_expiry } = newHeader;
      user = headerUser;
      authToken = auth_token;
      tokenExpiry = token_expiry;
    }

    if (!authToken || !user || !tokenExpiry) {
      console.log('Could not find any of the cookies or required headers');
      c.status(401);
      //console.log('Unauthorized');
      return c.json({ isAuthenticated: false });
    }
  }

  const currentTime = Math.floor(Date.now() / 1000);

  if (currentTime >= parseInt(tokenExpiry)) {
    c.status(401);
    //console.log('Unauthorized');
    return c.json({ isAuthenticated: false });
  }

  try {
    c.set('user-google', user as GoogleUser);
    c.set('token', JSON.parse(authToken));
    await next();
  } catch (err) {
    //console.error(`There was an error: \n${err}`);
    c.status(401);
    return c.json({ isAuthenticated: false });
  }

  // try {
  //   const tokens = await TokenManager.getTokens((user as GoogleUser).id as string);
  //   if (!tokens || tokens.accessToken !== authToken) {
  //     c.status(401);
  //     return c.json({ isAuthenticated: false });
  //   }
  //   c.set('user-google', user as GoogleUser);
  //   await next();
  // } catch (err) {
  //   c.status(401);
  //   return c.json({ isAuthenticated: false });
  // }
};
