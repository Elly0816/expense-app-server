declare global {
  namespace Bun {
    interface Env {
      PORT: string;
      CORS_ORIGIN: string;
      DATABASE_URL: string;
      // Add other env variables here
    }
  }
}

export type CategoryType =
  | 'Food & Drinks'
  | 'Groceries'
  | 'Shopping'
  | 'Transport'
  | 'Entertainment'
  | 'Utilities'
  | 'Health & Fitness'
  | 'Home'
  | 'Savings';
// | undefined;

export type ExpenseType = {
  category: CategoryType;
  expense: string;
  amount: number;
  date: Date;
};
export {};
