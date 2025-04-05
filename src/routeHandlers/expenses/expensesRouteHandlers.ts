import type { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { Expense } from '../../types';

export const handleCreateExpense = async (c: Context) => {
  try {
    const body = (await c.req.json()) as Expense;
    console.log(body);
    return c.json({ data: 'Expense has been added successfully' });
  } catch (error) {
    if (error instanceof HTTPException) {
      throw error;
    }
    return c.json({ error: error instanceof Error ? error.message : 'Internal Server Error' });
    // throw new HTTPException(500, { message: 'Internal Server Error' });
  }
};
