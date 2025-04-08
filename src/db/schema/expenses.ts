import { pgTable, varchar, integer, text, doublePrecision, date } from 'drizzle-orm/pg-core';

export const expenses = pgTable('expenses', {
  id: text('id').primaryKey(),
  category: varchar('string', { length: 255 }).notNull(),
  expense: varchar('expense', { length: 255 }).notNull(),
  amount: doublePrecision('amount').notNull(),
  date: date('date', { mode: 'date' }).defaultNow().notNull(),
});

export type Expense = typeof expenses.$inferSelect;
export type NewExpense = typeof expenses.$inferInsert;

// export type Expense = {
//     category: string;
//     expense: string;
//     amount: number;
//     date: string;
//   };
