import { Hono } from "hono";


export const app = new Hono();
export const port = process.env.PORT;

