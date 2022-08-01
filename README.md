# Minesweeper

Minesweeper clone built with Vue, Node.js (Express), and MongoDB. TypeScript is enabled globally. SCSS is used for styling, Vuex for state management, Passport and JWT for user authentication, Bcrypt for password hashing and Mongoose for database manipulation.

## Getting started

1. Install root dependencies:

   ```sh
   npm i
   ```

2. Install dependencies on the frontend and the backend:

   ```sh
   npm run install
   ```

3. Start the development server on the frontend and the backend:

   ```sh
   npm run dev
   ```

## Environment variables

### Frontend

- **VUE_APP_MINESWEEPER_API_URL**: Backend URL.

### Backend

- **MINESWEEPER_PORT**: Port the backend will run on.
- **MINESWEEPER_UI_URL**: Frontend URL.
- **MINESWEEPER_MONGODB_URI**: MongoDB database URI.
- **MINESWEEPER_JWT_SECRET**: JWT secret.

## Other commands

- Install dependencies on the frontend:

  ```sh
  npm run install:ui
  ```

- Install dependencies on the backend:

  ```sh
  npm run install:api
  ```

- Start the frontend development server:

  ```sh
  npm run dev:ui
  ```

- Start the backend development server:

  ```sh
  npm run dev:api
  ```
