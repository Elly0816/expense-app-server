import { Hono } from 'hono';
import { handleCreateExpense } from '../../routeHandlers/expenses/expensesRouteHandlers';

export const expense = new Hono();

expense.post('/', handleCreateExpense);
