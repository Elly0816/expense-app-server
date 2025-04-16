import { googleAuth } from '@hono/oauth-providers/google';
import type { MiddlewareHandler } from 'hono';

export const googleOauth: () => MiddlewareHandler = () => {
  return googleAuth({
    client_id: process.env.GOOGLE_CLIENT_ID,
    scope: ['profile', 'email', 'openid'],
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
  });
};
