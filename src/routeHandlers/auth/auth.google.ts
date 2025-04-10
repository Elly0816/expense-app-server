import type { Context } from 'hono';
import passport from 'passport';
import { TokenManager } from '../../redis/token.manager';

export const googleOauth: (c: Context) => Promise<void> = async (c) => {
  return await new Promise((resolve) => {
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      session: false,
    })(c, resolve);
  });
};

export const googleCallback: (c: Context) => Promise<Response> = async (c) => {
  return await new Promise((resolve) => {
    passport.authenticate('google', {
      session: false,
      failureRedirect: '/login',
    })(c, async (err: any, user: any) => {
      if (err || !user) {
        return resolve(c.redirect(`${process.env.CLIENT_URL}/login`));
      }

      // Get tokens from redis
      const tokens = await TokenManager.getTokens(user.id);
      if (!tokens) {
        return resolve(c.redirect(`${process.env.CLIENT_URL}/login`));
      }

      //Set the tokens in cookies or headers
      c.header('Authorization', `Bearer ${tokens.accessToken}`);

      return resolve(c.redirect(`${process.env.CLIENT_URL}`));
    });
  });
};

export const logout: (c: Context) => Promise<Response> = async (c) => {
  const userId = c.get('user')?.id;
  if (userId) {
    await TokenManager.removeTokens(userId);
  }
  return c.redirect(`${process.env.CLIENT_URL}/login`);
};
