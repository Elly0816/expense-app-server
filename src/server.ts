import { cors } from 'hono/cors';
import {app, port} from './index';
import home from './routes/homeRoute';

console.log("Environment Variables:", {
    CORS_ORIGIN: process.env.CORS_ORIGIN,
    PORT: process.env.PORT
})
  
app.use(cors({origin:  Bun.env.CORS_ORIGIN as unknown as string}));
app.route('/', home);

  export default {
    port,
    fetch: app.fetch,
  }