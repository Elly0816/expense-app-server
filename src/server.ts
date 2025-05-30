import { cors } from 'hono/cors';
import { app, port } from './index';
import home from './routes/homeRoute';
import { expense } from './routes/expense/expense';
import auth from './routes/auth/auth';
import { googleOauth } from './middlewares/auth';
import { logger } from 'hono/logger';
import type { Context, Next } from 'hono';
import { getConnInfo } from 'hono/bun';

console.log('Environment Variables:', {
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  PORT: process.env.PORT,
});

app.use(async (c: Context, next: Next): Promise<void> => {
  const req = c.req;

  console.log('=== REQUEST DEBUGGING ===');
  const info = getConnInfo(c);
  console.log(`The connection info is: `);
  console.log(info);
  console.log('\n');
  // console.log('req.protocol:', req.protocol);
  // console.log('req.secure:', req.secure);
  // console.log('req.get("host"):', req.get('host'));

  console.log('req.get("x-forwarded-proto"):', req.header('x-forwarded-proto'));
  console.log('req.get("x-forwarded-for"):', req.header('x-forwarded-for'));
  console.log('req.headers:', JSON.stringify(req.header(), null, 2));
  console.log('========================');
  next();
});
app.use(cors({ origin: Bun.env.CORS_ORIGIN as string, credentials: true }));
app.use(logger());
//This middleware initiates the oAuth process
app.use('auth/google', googleOauth());
app.route('/', home);
app.route('/expense', expense);
app.route('/auth', auth);

export default {
  port,
  fetch: app.fetch,
};
