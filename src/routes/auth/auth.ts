import { Hono } from 'hono';
import { googleCallback, googleOauth, logout } from '../../routeHandlers/auth/auth.google';

const auth = new Hono();

// Initialize google OAuth login route
auth.get('/google', googleOauth);

// Handle Google OAuth callback
auth.get('/google/callback', googleCallback);

// Handle logout
auth.get('/logout', logout);

export default auth;
