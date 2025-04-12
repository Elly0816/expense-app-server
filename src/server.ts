import { cors } from 'hono/cors';
import { app, port } from './index';
import home from './routes/homeRoute';
import { expense } from './routes/expense/expense';
import auth from './routes/auth/auth';
import passport from 'passport';
import './auth/passport.auth';
import { googleAuth } from '@hono/oauth-providers/google';

console.log('Environment Variables:', {
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  PORT: process.env.PORT,
});

app.use(cors({ origin: Bun.env.CORS_ORIGIN as string, credentials: true }));

//This initiates the oAuth process
app.use(
  'auth/google',
  googleAuth({
    client_id: process.env.GOOGLE_CLIENT_ID,
    scope: ['profile', 'email', 'openid'],
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
  })
);
app.route('/', home);
app.route('/expense', expense);
app.route('/auth', auth);

export default {
  port,
  fetch: app.fetch,
};
