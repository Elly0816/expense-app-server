import { relations } from 'drizzle-orm';
import { pgTable, varchar, integer, text, doublePrecision, date } from 'drizzle-orm/pg-core';
import { users } from './users';

export const expenses = pgTable('expenses', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  category: varchar('string', { length: 255 }).notNull(),
  expense: varchar('expense', { length: 255 }).notNull(),
  amount: doublePrecision('amount').notNull(),
  date: date('date', { mode: 'date' }).defaultNow().notNull(),
  userId: text('userId').notNull(),
});

export const expenseRelations = relations(expenses, ({ one }) => ({
  author: one(users, {
    fields: [expenses.userId],
    references: [users.id],
  }),
}));

export type Expense = typeof expenses.$inferSelect;
export type NewExpense = typeof expenses.$inferInsert;

// export type Expense = {
//     category: string;
//     expense: string;
//     amount: number;
//     date: string;
//   };
