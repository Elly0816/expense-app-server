import { cors } from 'hono/cors';
import { app, port } from './index';
import home from './routes/homeRoute';
import { expense } from './routes/expense/expense';
import auth from './routes/auth/auth';
import { googleOauth } from './middlewares/auth';
import { logger } from 'hono/logger';
import type { Context, MiddlewareHandler, Next } from 'hono';

console.log('Environment Variables:', {
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  PORT: process.env.PORT,
});

app.use(async (c: Context, next: Next): Promise<void | undefined> => {
  const req = c.req;

  console.log('=== REQUEST DEBUGGING ===');

  console.log('URL: ', req.raw.url);
  console.log('METHOD: ', req.raw.method);
  console.log('HEADERS:\n');

  console.log(req.raw.headers);

  console.log('Specific Proxy Headers:');
  console.log('  x-forwarded-proto:', c.req.header('x-forwarded-proto'));
  console.log('  x-forwarded-host:', c.req.header('x-forwarded-host'));
  console.log('  x-forwarded-for:', c.req.header('x-forwarded-for'));
  console.log('  host:', c.req.header('host'));
  console.log('================================');

  await next();
});
app.use(cors({ origin: Bun.env.CORS_ORIGIN as string, credentials: true }));
app.use(logger());
//This middleware initiates the oAuth process
app.use('auth/google', async (c: Context): Promise<void> => googleOauth(c));
app.route('/', home);
app.route('/expense', expense);
app.route('/auth', auth);

export default {
  port,
  fetch: app.fetch,
};
