import type { Context, MiddlewareHandler } from 'hono';
// import passport from 'passport';
import { TokenManager, type TokenData } from '../../redis/token.manager';
import { addUser, getUserById } from '../../db/queries/users.queries';
import type { User } from '../../db/schema/users';
import { revokeToken } from '@hono/oauth-providers/google';
import { setCookie } from 'hono/cookie';

export const googleOAuthCallback: (c: Context) => Promise<Response> = async (c) => {
  const access = c.get('token');
  const grantedScopes = c.get('granted-scopes');
  const user = c.get('user-google');
  const refresh = c.get('refresh-token');
  // Check the db for the user, if the user is not there, add them. If the user is, store tokens and sign the user in

  console.log('Handshake with google successful! \n\n\n\n');
  try {
    const userFromDB = (await getUserById(user?.id as string)) as User[];
    if (userFromDB?.length > 0) {
      console.log('Created the user successfully!');
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
        }
      } catch (error) {
        c.status(500);
        console.log('There was an error creating the user! ');
        return c.body('Error creating the user');
      }
    }
  } catch (error) {
    c.status(500);
    console.log('There was an error getting the user!');
    return c.body('Error getting the user');
  }

  try {
    await TokenManager.storeTokens(
      user?.id as string,
      {
        accessToken: access?.token ?? null,
        refreshToken: refresh?.token ?? null,
        accessExpires: access?.expires_in ?? null,
        refreshExpires: refresh?.expires_in ?? null,
      } as TokenData
    );

    console.log('Access Token: \n');
    console.log(access);

    setCookie(c, 'auth_token', access?.token as string, {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });
    setCookie(c, 'user', JSON.stringify(user) as string, {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      path: '/',
    });

    // return c.json({ user: user });
    return c.redirect(`${process.env.CLIENT_URL}/`);
  } catch (error) {
    c.status(500);
    return c.body('Error storing the tokens');
  }
};

export const logout: (c: Context) => Promise<Response> = async (c) => {
  const userId = c.get('user')?.id;
  if (userId) {
    const accessToken = ((await TokenManager.getTokens(userId)) as TokenData).accessToken;
    const accessExpires = ((await TokenManager.getTokens(userId)) as TokenData).accessExpires;
    const token = { token: accessToken, expires_in: accessExpires };
    revokeToken(JSON.stringify(token));
    await TokenManager.removeTokens(userId);
  }
  return c.redirect(`${process.env.CLIENT_URL}/login`);
};
