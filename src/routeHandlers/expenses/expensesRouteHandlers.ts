import type { Context } from 'hono';
import type { GoogleUser } from '@hono/oauth-providers/google';
import {
  createExpense,
  deleteExpense,
  getExpenseByDate,
  getExpensesByCategory,
} from '../../db/queries/expenses.queries';
import type { CategoryType, ExpenseType } from '../../types';
import { defaultErrorResponse } from '../../utils/defaultErrorResponse';
import { convertToYMD } from '../../utils/convertToYMD';

type ExpenseFromClient = Omit<ExpenseType, 'id'>;

export const handleCreateExpense = async (c: Context) => {
  try {
    const body = (await c.req.json()) as ExpenseFromClient;
    const userId = (c.get('user-google') as GoogleUser).id;
    //console.log(body);
    const result = await createExpense({ expense: body, userId: userId });
    c.status(201);
    return c.json({ text: 'Expense has been added successfully' });
  } catch (error) {
    //console.error(`There was an error creating the expense: \n${error}`);
    // if (error instanceof HTTPException) {
    //   throw error;
    // }
    c.status(500);
    return c.json(defaultErrorResponse);
  }
};

export const handleGetExpense: (c: Context) => Promise<Response> = async (c: Context) => {
  const category = c.req.param('category') as CategoryType;
  const userId = (c.get('user-google') as GoogleUser).id;

  // //console.log('This is the category: ', category);
  try {
    const expenses = await getExpensesByCategory({ category, userId });
    c.status(200);
    return c.json({ expenses: expenses });
  } catch (error) {
    //console.error('There was an error getting the expense: ', error);
    // if (error instanceof HTTPException) {
    //   throw error;
    // }
    c.status(500);
    return c.json(defaultErrorResponse);
  }

  // return c.json({ data: `The category you're looking for is ${category}` });
};

export const handleDeleteExpense: (c: Context) => Promise<Response> = async (c: Context) => {
  const id = c.req.param('id');
  const userId = (c.get('user-google') as GoogleUser).id;
  try {
    await deleteExpense({ id: Number(id), userId: userId });
    c.status(200);
    return c.json({ text: 'Expense deleted successfully' });
  } catch (error) {
    c.status(500);
    return c.json(defaultErrorResponse);
  }
};

export const handleGetByDateRange: (c: Context) => Promise<Response> = async (c: Context) => {
  let startDate: string | Date = c.req.param('startDate');
  let endDate: string | Date = c.req.param('endDate');
  let category: CategoryType | undefined | string = c.req.param('category');
  if (category === 'undefined') {
    category = undefined;
  }
  const userId = (c.get('user-google') as GoogleUser).id;
  startDate = new Date(startDate);
  endDate = new Date(endDate);
  // //console.log(`This is the start Date: ${startDate}`);
  // //console.log(`This is the end Date: ${endDate}`);
  try {
    const expenses = await getExpenseByDate({
      endDate: endDate,
      startDate: startDate,
      userId: userId,
      category: category as CategoryType,
    });
    c.status(200);
    return c.json({ expenses: expenses });
  } catch (error) {
    //console.error('There was an error getting the expense', error);
    c.status(500);
    return c.json(defaultErrorResponse);
  }
};

export const handleGetPastDay: (c: Context) => Promise<Response> = async (c) => {
  let category: string | CategoryType | undefined = c.req.param('category');
  let currentDay: string | Date = c.req.param('currentDay');
  const userId = (c.get('user-google') as GoogleUser).id;

  if (category === 'undefined') {
    category = undefined;
  }
  currentDay = new Date(currentDay);
  const pastDay = new Date(currentDay.getTime() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(pastDay.getTime() - 24 * 60 * 60 * 1000);
  //console.log('For past day');

  try {
    const [expenseOverThePastDay, expenseOverPriorDays] = await Promise.all([
      getExpenseByDate({
        endDate: convertToYMD(currentDay),
        startDate: convertToYMD(pastDay),
        userId: userId,
        category: category as CategoryType,
      }),
      getExpenseByDate({
        endDate: convertToYMD(pastDay),
        startDate: convertToYMD(twoDaysAgo),
        userId: userId,
        category: category as CategoryType,
      }),
    ]);

    c.status(200);
    return c.json({ expenses: { last: expenseOverThePastDay, prior: expenseOverPriorDays } });
  } catch (error) {
    //console.log('There was an error getting the expenses', error);
    c.status(500);
    return c.json(defaultErrorResponse);
  }
};

export const handleGetPastWeek: (c: Context) => Promise<Response> = async (c) => {
  let category: string | CategoryType | undefined = c.req.param('category');
  let currentDay: string | Date = c.req.param('currentDay');
  const userId = (c.get('user-google') as GoogleUser).id;

  if (category === 'undefined') {
    category = undefined;
  }
  currentDay = new Date(currentDay);
  const lastWeek = new Date(currentDay.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(lastWeek.getTime() - 7 * 24 * 60 * 60 * 1000);
  //console.log('For past week');
  try {
    const [expenseOverThePastWeek, expenseOverPriorWeek] = await Promise.all([
      getExpenseByDate({
        endDate: convertToYMD(currentDay),
        startDate: convertToYMD(lastWeek),
        userId: userId,
        category: category as CategoryType,
      }),
      getExpenseByDate({
        endDate: convertToYMD(lastWeek),
        startDate: convertToYMD(twoWeeksAgo),
        userId: userId,
        category: category as CategoryType,
      }),
    ]);
    c.status(200);
    return c.json({ expenses: { last: expenseOverThePastWeek, prior: expenseOverPriorWeek } });
  } catch (error) {
    //console.log('There was an error getting the expenses', error);
    c.status(500);
    return c.json(defaultErrorResponse);
  }
};

export const handleGetPastMonth: (c: Context) => Promise<Response> = async (c) => {
  let category: string | CategoryType | undefined = c.req.param('category');
  let currentDay: string | Date = c.req.param('currentDay');
  const userId = (c.get('user-google') as GoogleUser).id;

  if (category === 'undefined') {
    category = undefined;
  }

  currentDay = new Date(currentDay);
  const lastMonth = new Date(
    currentDay.getFullYear(),
    currentDay.getMonth() - 1,
    currentDay.getDate()
  );
  const twoMonthsAgo = new Date(
    currentDay.getFullYear(),
    currentDay.getMonth() - 2,
    currentDay.getDate()
  );
  //console.log('For past month');

  try {
    const [expenseOverThePastMonth, expenseOverPriorMonth] = await Promise.all([
      getExpenseByDate({
        endDate: convertToYMD(currentDay),
        startDate: convertToYMD(lastMonth),
        userId: userId,
        category: category as CategoryType,
      }),
      getExpenseByDate({
        endDate: convertToYMD(lastMonth),
        startDate: convertToYMD(twoMonthsAgo),
        userId: userId,
        category: category as CategoryType,
      }),
    ]);

    c.status(200);
    return c.json({ expenses: { last: expenseOverThePastMonth, prior: expenseOverPriorMonth } });
  } catch (error) {
    //console.log('There was an error getting the expenses', error);
    c.status(500);
    return c.json(defaultErrorResponse);
  }
};

export const handleGetPastYear: (c: Context) => Promise<Response> = async (c) => {
  let category: string | CategoryType | undefined = c.req.param('category');
  let currentDay: string | Date = c.req.param('currentDay');
  const userId = (c.get('user-google') as GoogleUser).id;

  if (category === 'undefined') {
    category = undefined;
  }

  currentDay = new Date(currentDay);
  const lastYear = new Date(
    currentDay.getFullYear() - 1,
    currentDay.getMonth(),
    currentDay.getDate()
  );
  //console.log('For past year');
  const twoYearsAgo = new Date(
    currentDay.getFullYear() - 2,
    currentDay.getMonth(),
    currentDay.getDate()
  );

  try {
    const [expenseOverThePastYear, expenseOverPriorYear] = await Promise.all([
      getExpenseByDate({
        endDate: convertToYMD(currentDay),
        startDate: convertToYMD(lastYear),
        userId: userId,
        category: category as CategoryType,
      }),
      getExpenseByDate({
        endDate: convertToYMD(lastYear),
        startDate: convertToYMD(twoYearsAgo),
        userId: userId,
        category: category as CategoryType,
      }),
    ]);

    c.status(200);
    return c.json({ expenses: { last: expenseOverThePastYear, prior: expenseOverPriorYear } });
  } catch (error) {
    //console.log('There was an error getting the expenses', error);
    c.status(500);
    return c.json(defaultErrorResponse);
  }
};
