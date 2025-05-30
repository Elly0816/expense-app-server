import { Hono, type Context, type Next } from 'hono';
import { googleOAuthCallback, logout } from '../../routeHandlers/auth/auth.google';
import { checkAuth } from '../../middlewares/auth';
import { authChecker } from '../../routeHandlers/auth/checkAuth';

const auth = new Hono();

// This is the callback route that google's oAuth uses
auth.get(
  '/google',
  //   (c: Context, next: Next) => {
  //     console.log(
  //       '\n\n\nThis is a GET request to the auth/google endpoint from within a middleware in the auth get route\n\n\n'
  //     );
  //     next();
  //   },
  googleOAuthCallback
);

// Handle logout
auth.get('/logout', logout);

//checks if the user is still authenticated
auth.get('/check', checkAuth, authChecker);

export default auth;
