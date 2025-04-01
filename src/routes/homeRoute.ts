import {Hono} from 'hono';


const home = new Hono();


home.get('/', (c) => {
    return c.text("Hello World");
  });


export default home;