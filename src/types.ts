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

export type ExpenseType = {
  category: string;
  expense: string;
  amount: number;
  date: string;
};
export {};
