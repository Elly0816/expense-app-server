import { Hono } from 'hono';
import {
  handleCreateExpense,
  handleGetExpense,
} from '../../routeHandlers/expenses/expensesRouteHandlers';
import { checkAuth } from '../../middlewares/auth';

export const expense = new Hono();

expense.use(checkAuth);
expense.post('/', handleCreateExpense);
expense.get('/:category', handleGetExpense);
