# Expense App Server

## Overview

The **expense-app-server** is a backend service for an expense tracking application, built with **TypeScript**, the **Bun** runtime, and the **Hono** web framework. It provides RESTful APIs for managing expenses and user authentication via Google OAuth. The backend uses **Drizzle ORM** with **PostgreSQL** for persistent data storage and **Redis** for secure session and token management.

## Features

- **Google OAuth Authentication:** Secure user login and registration using Passport.js and Google OAuth 2.0.
- **Expense Management APIs:** Full CRUD (Create, Read, Update, Delete) endpoints for managing user expenses.
- **PostgreSQL Integration:** Data persistence using Drizzle ORM for type-safe database access.
- **Redis Token Management:** Fast, in-memory session and token storage for improved security and performance.
- **TypeScript Strictness:** Enforced type safety and reliability throughout the codebase.
- **Modular Structure:** Clear separation of concerns for scalability and maintainability.

## Setup

1. **Clone the repository and navigate to the project directory.**

2. **Create a `.env` file in the project root with the following variables:**

   - `PORT`
   - `DATABASE_URL`
   - `CORS_ORIGIN`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_REDIRECT`
   - `CLIENT_URL`

3. **Install dependencies:**

   ```bash
   bun install
   ```

4. **Run database migrations (if applicable):**

   ```bash
   # Add your migration command here if using Drizzle Kit or similar
   ```

5. **Start the server:**
   ```bash
   bun run index.ts
   ```

## Project Structure

- **src/**: Main application code (server setup, middleware, controllers)
- **db/**: Database schema definitions and query logic (Drizzle ORM)
- **redis/**: Redis client and token/session management logic
- **auth/**: Authentication strategies and Passport configuration
- **routes/**: API route definitions and handlers

## Contributing

Pull requests and issues are welcome! Please ensure code is well-tested and follows the project's TypeScript and formatting guidelines.

---

Enjoy building your expense tracking application!
