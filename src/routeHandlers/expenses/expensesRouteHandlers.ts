import type { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { Expense } from '../../db/schema/expenses';
import type { GoogleUser } from '@hono/oauth-providers/google';
import { createExpense, getExpensesByCategory } from '../../db/queries/expenses.queries';
import type { CategoryType, ExpenseType } from '../../types';
import { defaultErrorResponse } from '../../utils/defaultErrorResponse';

type ExpenseFromClient = Omit<ExpenseType, 'id'>;

export const handleCreateExpense = async (c: Context) => {
  try {
    const body = (await c.req.json()) as ExpenseFromClient;
    const userId = (c.get('user-google') as GoogleUser).id;
    console.log(body);
    const result = await createExpense({ expense: body, userId: userId });
    c.status(201);
    return c.json({ text: 'Expense has been added successfully' });
  } catch (error) {
    console.error(`There was an error creating the expense: \n${error}`);
    if (error instanceof HTTPException) {
      throw error;
    }
    c.status(500);
    return c.json(defaultErrorResponse);
  }
};

export const handleGetExpense: (c: Context) => Promise<Response> = async (c: Context) => {
  const category = c.req.param('category') as CategoryType;
  const userId = (c.get('user-google') as GoogleUser).id;

  console.log('This is the category: ', category);
  try {
    const expenses = await getExpensesByCategory({ category, userId });
    c.status(200);
    return c.json({ expenses: expenses });
  } catch (error) {
    console.error('There was an error getting the expense: ', error);
    if (error instanceof HTTPException) {
      throw error;
    }
    c.status(500);
    return c.json(defaultErrorResponse);
  }

  // return c.json({ data: `The category you're looking for is ${category}` });
};
