import { eq, and } from 'drizzle-orm';
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
