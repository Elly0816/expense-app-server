import type { Context, MiddlewareHandler } from 'hono';
// import passport from 'passport';
import { TokenManager, type TokenData } from '../../redis/token.manager';
import { addUser, getUserById } from '../../db/queries/users.queries';
import type { User } from '../../db/schema/users';
import { revokeToken } from '@hono/oauth-providers/google';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import type { CookieOptions } from 'hono/utils/cookie';
import { isProd } from '../../utils/isProd';

export const googleOAuthCallback: (c: Context) => Promise<Response> = async (c) => {
  const accessToken = c.get('token');
  const user = c.get('user-google');
  // Check the db for the user, if the user is not there, add them. If the user is, store tokens and sign the user in

  //console.log('Handshake with google successful! \n\n\n\n');
  try {
    const userFromDB = (await getUserById(user?.id as string)) as User[];
    if (userFromDB?.length > 0) {
      //console.log('Created the user successfully!');
      c.status(200);
    } else {
      try {
        const newUser = (await addUser({
          id: user?.id as string,
          email: user?.email as string,
          name: `${user?.given_name as string} ${user?.family_name as string}`,
        })) as User[];
        if (newUser?.length > 0) {
          c.status(201);
        } else {
          c.status(500);
          return c.text('Error adding the user');
        }
      } catch (error) {
        c.status(500);
        //console.log('There was an error creating the user! ');
        return c.text('Error creating the user');
      }
    }
  } catch (error) {
    c.status(500);
    //console.log('There was an error getting the user!');
    return c.text('Error getting the user');
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const tokenExpiry = 60 * 60 * 24;
  // const tokenExpiry = 30;

  const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: isProd() ? 'none' : 'lax',
    maxAge: tokenExpiry,
    path: '/',
  };

  setCookie(c, 'token_expiry', String(currentTime + tokenExpiry), cookieOptions);
  setCookie(c, 'auth_token', JSON.stringify(accessToken), cookieOptions);
  setCookie(c, 'user', JSON.stringify(user) as string, cookieOptions);

  // return c.json({ user: user });
  //console.log('Before redirecting');
  return c.redirect(`${process.env.CLIENT_URL}/`);
  // try {
  //   await TokenManager.storeTokens(
  //     user?.id as string,
  //     {
  //       accessToken: access?.token ?? null,
  //       refreshToken: refresh?.token ?? null,
  //       accessExpires: access?.expires_in ?? null,
  //       refreshExpires: refresh?.expires_in ?? null,
  //     } as TokenData
  //   );

  //   //console.log('Access Token: \n');
  //   //console.log(access);

  // } catch (error) {
  //   c.status(500);
  //   return c.text('Error storing the tokens');
  // }
};

export const logout: (c: Context) => Promise<Response> = async (c) => {
  const token = c.get('token');
  revokeToken(token?.token as string);
  c.set('user-google', undefined);
  c.set('token', undefined);
  deleteCookie(c, 'user', {
    secure: true,
    path: '/',
    httpOnly: true,
    sameSite: 'None',
  });
  deleteCookie(c, 'auth_token', {
    secure: true,
    path: '/',
    httpOnly: true,
    sameSite: 'None',
  });
  deleteCookie(c, 'token_expiry', {
    secure: true,
    path: '/',
    httpOnly: true,
    sameSite: 'None',
  });

  // if (userId) {
  //   const accessToken = ((await TokenManager.getTokens(userId)) as TokenData).accessToken;
  //   const accessExpires = ((await TokenManager.getTokens(userId)) as TokenData).accessExpires;
  //   const token = { token: accessToken, expires_in: accessExpires };
  //   revokeToken(JSON.stringify(token));
  //   await TokenManager.removeTokens(userId);
  // }
  // c.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN);
  // return c.redirect(`${process.env.CLIENT_URL}/login`);
  return c.json({ isAuthenticated: false });
};
