import { Hono } from 'hono';
import { googleOauth, logout } from '../../routeHandlers/auth/auth.google';

const auth = new Hono();

// This is the callback route that google's oAuth uses
auth.get('/google', googleOauth);

// Handle logout
auth.get('/logout', logout);

export default auth;
