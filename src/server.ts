import { cors } from 'hono/cors';
import { app, port } from './index';
import home from './routes/homeRoute';
import { expense } from './routes/expense/expense';
import auth from './routes/auth/auth';
import { googleOauth } from './middlewares/auth';
import { logger } from 'hono/logger';
import type { Context, MiddlewareHandler, Next } from 'hono';
import { buildCallbackURL } from './utils/properURLConstruction';
import { getCookie } from 'hono/cookie';

console.log('Environment Variables:', {
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  PORT: process.env.PORT,
});

app.use(
  '*',
  cors({
    origin: process.env.CORS_ORIGIN as string,
    credentials: true,
    // allowHeaders: [
    //   'Content-Type',
    //   'Authorization',
    //   'X-Requested-With', // Some frontend frameworks add this automatically
    // ],
    // allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    // // Expose headers that your frontend might need to read
    // exposeHeaders: ['Set-Cookie'],
  })
);

// app.use(async (c: Context, next: Next): Promise<void | undefined> => {
//   const req = c.req;

//   console.log('=== REQUEST DEBUGGING ===');

//   console.log('URL: ', req.raw.url);
//   console.log('METHOD: ', req.raw.method);
//   console.log('HEADERS:\n');

//   console.log(req.raw.headers);

//   console.log('Specific Proxy Headers:');
//   console.log('  x-forwarded-proto:', c.req.header('x-forwarded-proto'));
//   console.log('  x-forwarded-host:', c.req.header('x-forwarded-host'));
//   console.log('  x-forwarded-for:', c.req.header('x-forwarded-for'));
//   console.log('  host:', c.req.header('host'));
//   console.log('================================');

//   await next();
// });

app.use(logger());

// app.use(async (c: Context, next: Next) => {
//   const cookies = c.req.header('cookie');

//   console.log('\n\nHere are the current cookies: ');
//   console.log(cookies);
//   console.log('\n\n');

//   const token_expiry = getCookie(c, 'token_expiry');
//   const auth_token = getCookie(c, 'auth_token');
//   const user = getCookie(c, 'user');

//   console.log('\n\nHere are the specific cookies: ');
//   console.log(`User: ${user}`);
//   console.log(`Token Expiry: ${token_expiry}`);
//   console.log(`Auth Token: ${auth_token}`);
//   console.log('\n\n');

//   return await next();
// });
//This middleware initiates the oAuth process

// app.use('auth/google', googleOauth());
app.use('auth/google', async (c: Context, next: Next) => {
  const callbackURL = buildCallbackURL(c);

  const oAuthMiddleware = googleOauth(callbackURL);

  return await oAuthMiddleware(c, next);
});
app.route('/', home);
app.route('/expense', expense);
app.route('/auth', auth);

export default {
  port,
  fetch: app.fetch,
};
