# Expense App Server

## Overview

The expense-app-server is a TypeScript backend built with the Bun runtime and Hono framework. It provides APIs for managing expenses and user authentication via Google OAuth using Passport. Database operations are handled by Drizzle ORM with PostgreSQL, and Redis is used for token management.

## Features

- Google OAuth authentication using Passport
- Expense management CRUD APIs
- PostgreSQL integration with Drizzle ORM
- Redis-based token management for secure sessions
- Strict TypeScript setup for enhanced reliability

## Setup

1. Create a `.env` file in the project root with your environment variables:
   - PORT
   - DATABASE_URL
   - CORS_ORIGIN
   - GOOGLE_CLIENT_ID
   - GOOGLE_CLIENT_SECRET
   - GOOGLE_REDIRECT
   - CLIENT_URL
2. Install dependencies:
   ```bash
   bun install
   ```
3. Run the server:
   ```bash
   bun run index.ts
   ```

## Project Structure

- **src/**: Application code including server, routes, and handlers
- **db/**: Database schema and query logic
- **redis/**: Token management using Redis
- **auth/**: User authentication configuration
- **routes/**: API route definitions

Enjoy developing your expense tracking application!
