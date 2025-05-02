# Expense App Server

## Overview

The **Expense App Server** is a robust, scalable backend service designed for a modern expense tracking application. Built with **TypeScript**, the **Bun** JavaScript runtime, and the **Hono** web framework, it provides secure, high-performance RESTful APIs for managing user authentication, expense data, and session management. The backend leverages **Drizzle ORM** for type-safe database operations with **PostgreSQL**, and uses **Redis** for efficient token and session storage.

This server is intended to be paired with a Next.js/React client (see `expense-app-client`), but can be used with any frontend capable of consuming RESTful APIs.

---

## Features

- **Google OAuth 2.0 Authentication:** Secure user login and registration using Google accounts, with seamless session management.
- **Expense Management APIs:** Full CRUD (Create, Read, Update, Delete) endpoints for user expenses, organized by categories.
- **PostgreSQL Integration:** Persistent, reliable data storage using Drizzle ORM for type-safe, maintainable queries.
- **Redis Token Management:** Fast, in-memory storage for access and refresh tokens, improving both security and performance.
- **TypeScript Strictness:** Strong typing and strict compiler options ensure code reliability and maintainability.
- **Modular, Scalable Architecture:** Clear separation of concerns for routes, middleware, database, and utilities.
- **CORS Support:** Configurable CORS origins for secure cross-origin requests.
- **Logging and Error Handling:** Built-in middleware for request logging and standardized error responses.

---

## Architecture

- **Runtime:** [Bun](https://bun.sh/) — Ultra-fast JavaScript runtime.
- **Framework:** [Hono](https://hono.dev/) — Lightweight, modern web framework for building APIs.
- **Database:** [PostgreSQL](https://www.postgresql.org/) — Relational database, accessed via [Drizzle ORM](https://orm.drizzle.team/).
- **Authentication:** [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2) via [@hono/oauth-providers](https://github.com/honojs/oauth-providers).
- **Session/Token Store:** [Redis](https://redis.io/) — Used for storing access and refresh tokens.
- **Environment Management:** Uses `.env` files for configuration.

---

## Project Structure

```
expense-app-server/
├── src/
│   ├── db/            # Database schema definitions and query logic (Drizzle ORM)
│   ├── middlewares/   # Authentication and other middleware
│   ├── redis/         # Redis client and token/session management
│   ├── routeHandlers/ # Route handler functions (controllers)
│   ├── routes/        # API route definitions
│   ├── utils/         # Utility functions (e.g., error responses)
│   ├── types.ts       # Shared TypeScript types
│   ├── index.ts       # Hono app instance and port export
│   └── server.ts      # Server entry point (mounts routes, middleware, etc.)
├── drizzle.config.ts  # Drizzle ORM configuration
├── package.json
├── tsconfig.json
├── .env.example       # Example environment variables
└── README.md
```

---

## Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/expense-app-server.git
cd expense-app-server
```

### 2. Configure Environment Variables

Create a `.env` file in the project root with the following variables:

```
PORT=8080
DATABASE_URL=postgres://user:password@host:port/database
CORS_ORIGIN=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT=http://localhost:8080/auth/google
CLIENT_URL=http://localhost:3000
REDIS_DB=redis://localhost:6379
```

> **Note:** Adjust values as needed for your environment.

### 3. Install Dependencies

```bash
bun install
```

### 4. Run Database Migrations

If using Drizzle Kit or another migration tool, run your migrations to set up the database schema:

```bash
# Example (if using Drizzle Kit)
bunx drizzle-kit push
```

### 5. Start the Server

```bash
bun run src/server.ts
```

The server will start on the port specified in your `.env` file (default: 8080).

---

## API Endpoints

### Authentication

- `GET /auth/google` — Initiate Google OAuth login.
- `GET /auth/google/callback` — Google OAuth callback.
- `GET /auth/logout` — Log out the current user.
- `GET /auth/check` — Check if the user is authenticated.

### Expenses

- `POST /expense` — Create a new expense (authenticated).
- `GET /expense/:category` — Get expenses by category (authenticated).
- `DELETE /expense/:id` — Delete an expense by ID (authenticated).

### Home

- `GET /` — Simple health check or welcome route.

---

## Technologies Used

- **Bun**: Lightning-fast JavaScript runtime.
- **Hono**: Modern, minimal web framework for building APIs.
- **Drizzle ORM**: Type-safe, flexible ORM for PostgreSQL.
- **PostgreSQL**: Reliable, open-source relational database.
- **Redis**: In-memory data store for session and token management.
- **Google OAuth 2.0**: Secure authentication and user management.
- **TypeScript**: Strict typing for safer, more maintainable code.
- **dotenv**: Environment variable management.

---

## Development & Best Practices

- **Type Safety:** All code is written in TypeScript with strict compiler options.
- **Modularity:** Each concern (routes, middleware, DB, auth, etc.) is separated for clarity and scalability.
- **Security:** Uses HTTP-only cookies, secure token storage, and CORS configuration.
- **Logging:** Built-in request logging for easier debugging.
- **Error Handling:** Standardized error responses for all endpoints.

---

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a new branch**:  
   `git checkout -b feature/your-feature`
3. **Commit your changes**:  
   `git commit -am 'Add new feature'`
4. **Push to the branch**:  
   `git push origin feature/your-feature`
5. **Open a pull request**

Please ensure your code is well-tested, follows the project's TypeScript and formatting guidelines, and includes clear documentation/comments where appropriate.

---

## License

**Author:** Eleazar  
**License:** MIT

---

## Related Projects

- [expense-app-client](https://github.com/Elly0816/expense-app-client) — The Next.js/React frontend for this server.

---

Enjoy building and managing your expenses with Expense App Server!
