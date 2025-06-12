import { Hono } from 'hono';
import {
  handleCreateExpense,
  handleDeleteExpense,
  handleGetByDateRange,
  handleGetExpense,
  handleGetPastDay,
  handleGetPastMonth,
  handleGetPastWeek,
  handleGetPastYear,
} from '../../routeHandlers/expenses/expensesRouteHandlers';
import { checkAuth } from '../../middlewares/auth';

export const expense = new Hono();

expense.use(checkAuth);
expense.post('/', handleCreateExpense);
expense.get('/:category', handleGetExpense);
expense.delete('/:id', handleDeleteExpense);
expense.get('/date-range/:category/:startDate/:endDate', handleGetByDateRange);
expense.get('/day/:category/:currentDay', handleGetPastDay);
expense.get('/week/:category/:currentDay', handleGetPastWeek);
expense.get('/month/:category/:currentDay', handleGetPastMonth);
expense.get('/year/:category/:currentDay', handleGetPastYear);
