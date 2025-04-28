import { relations } from 'drizzle-orm';
import { pgTable, text, varchar } from 'drizzle-orm/pg-core';
import { expenses } from './expenses';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  provider: varchar('provider', { length: 50 }).default('google'),
});

export const userRelations = relations(users, ({ many }) => ({
  expenses: many(expenses),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
