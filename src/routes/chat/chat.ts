import { Hono } from 'hono';
import { checkAuth } from '../../middlewares/auth';
import handleChat from '../../routeHandlers/chat/chatRouteHandler';

const chat = new Hono();

chat.post('/', checkAuth, handleChat);

export default chat;
