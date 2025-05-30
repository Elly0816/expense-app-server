import { Hono } from 'hono';
import { googleOAuthCallback, logout } from '../../routeHandlers/auth/auth.google';
import { checkAuth, googleOauth } from '../../middlewares/auth';
import { authChecker } from '../../routeHandlers/auth/checkAuth';

const auth = new Hono();

// This is the callback route that google's oAuth uses
auth.get('/google', googleOauth, googleOAuthCallback);

// Handle logout
auth.get('/logout', logout);

//checks if the user is still authenticated
auth.get('/check', checkAuth, authChecker);

export default auth;
