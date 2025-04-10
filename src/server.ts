import { cors } from 'hono/cors';
import { app, port } from './index';
import home from './routes/homeRoute';
import { expense } from './routes/expense/expense';
import auth from './routes/auth/auth';

console.log('Environment Variables:', {
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  PORT: process.env.PORT,
});

app.use(cors({ origin: Bun.env.CORS_ORIGIN as string }));
app.route('/', home);
app.route('/expense', expense);
app.route('/auth', auth);

export default {
  port,
  fetch: app.fetch,
};
