import {Hono} from 'hono';
import { getHomeRouteHandler } from '../routeHandlers/homeRouteHandler';


const home = new Hono();


home.get('/', getHomeRouteHandler);


export default home;