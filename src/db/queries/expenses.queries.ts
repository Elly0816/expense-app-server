import { eq, and, between } from 'drizzle-orm';
import db from '..';
import type { CategoryType } from '../../types';
import { expenses, type Expense, type NewExpense } from '../schema/expenses';

type userExpenseByCategoryType = {
  category: CategoryType;
  userId: string;
};

type createExpenseType = {
  expense: Omit<NewExpense, 'userId'>;
  userId: string;
};

type deleteExpenseType = {
  id: number;
  userId: string;
};

type userExpenseByDate = {
  startDate: Date;
  endDate: Date;
  userId: string;
  category: CategoryType | undefined;
};

type editExpenseType = {
  id: number;
};

export const getExpensesByCategory: ({
  category,
  userId,
}: userExpenseByCategoryType) => Promise<Expense[]> = async ({ category, userId }) => {
  try {
    const result = await db
      .select()
      .from(expenses)
      .where(and(eq(expenses.userId, userId), eq(expenses.category, category as string)));
    if (result.length > 0) {
      return result;
    }
    return [];
  } catch (error) {
    console.error('There was an error getting the expense', error);
    throw new Error('There was an error getting the expense');
  }
};

export const getExpenseByDate: ({
  startDate,
  endDate,
  userId,
  category,
}: userExpenseByDate) => Promise<Expense[]> = async ({ startDate, endDate, userId, category }) => {
  //console.log(`\n\nstartDate: ${startDate}\nendDate: ${endDate}`);
  //console.log(`Here is the userId: ${userId}`);
  //console.log(`Here is the category: ${category}`);
  const newStartDate: Date = new Date(startDate);
  const newEndDate: Date = new Date(endDate);
  try {
    let result: Expense[];
    if (!category) {
      result = await db
        .select()
        .from(expenses)
        .where(and(eq(expenses.userId, userId), between(expenses.date, newStartDate, newEndDate)));
      //console.log(`Here are the results of the query: result: ${result}`);
      if (result.length > 0) {
        return result;
      }
      return [];
    }
    result = await db
      .select()
      .from(expenses)
      .where(
        and(
          eq(expenses.userId, userId),
          between(expenses.date, newStartDate, newEndDate),
          eq(expenses.category, category)
        )
      );
    //console.log(`Here are the results of the query: result: ${result}`);
    if (result.length > 0) {
      return result;
    }
    return [];
  } catch (error) {
    console.log(`There was an error getting the expense: ${error}`);
    throw new Error('There was an expense getting the expense');
  }
};

export const createExpense: (expenseFromUser: createExpenseType) => Promise<NewExpense[]> = async (
  expenseFromUser
) => {
  const { expense, userId } = expenseFromUser;

  try {
    const result = await db
      .insert(expenses)
      .values({ ...expense, userId: userId, date: new Date(expense.date || Date.now()) })
      .returning();
    if (result.length > 0) {
      return result;
    }
    return [];
  } catch (error) {
    console.error('There was an error creating the Expense!');
    throw new Error(`There was an error creating the expense:\n${error}`);
  }
};

export const deleteExpense: ({ id, userId }: deleteExpenseType) => Promise<Expense[]> = async ({
  id,
  userId,
}) => {
  try {
    const deletedExpense = await db
      .delete(expenses)
      .where(and(eq(expenses.id, id), eq(expenses.userId, userId)))
      .returning();
    return deletedExpense;
  } catch (error) {
    console.error('There was an error while deleting the expense from the database!');
    throw new Error(`There was an error while deleting the expense:\n${error}`);
  }
};

export const getExpenseById: ({ id }: editExpenseType) => Promise<Expense[]> = async ({ id }) => {
  try {
    const result = await db.select().from(expenses).where(eq(expenses.id, id));
    if (result.length > 0) {
      return result;
    }
    return [];
  } catch (error) {
    throw new Error(`There was an error while getting the expense by it's id: ${id}`);
  }
};

export const editExpense: ({
  expense,
  id,
}: {
  expense: Omit<createExpenseType['expense'], 'userId'>;
  id: number;
}) => Promise<Expense[]> = async ({ expense, id }) => {
  const expenseId = id;

  const result = await db
    .update(expenses)
    .set({ ...expense, date: new Date(expense.date as Date) })
    .where(eq(expenses.id, expenseId))
    .returning();

  return result;
};
