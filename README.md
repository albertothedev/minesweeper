# Minesweeper

Minesweeper clone built with Vue, Node.js (Express), and MongoDB. TypeScript is enabled globally. SCSS is used for styling, Vuex for state management, Passport and JWT for user authentication, Bcrypt for password hashing, Mongoose for database manipulation, and Docker for local development.

## Getting started

1. Installs dependencies on frontend and backend (/ui and /api).

   ```sh
   npm run install
   ```

2. Builds the images for the frontend, the backend, and the database and creates three containers from them.

   ```sh
   npm run start
   ```

## Environment variables

Specified in /.env.development.

- **MINESWEEPER_PORT**: Port the backend will run on.
- **MINESWEEPER_JWT_SECRET**: JWT secret.
- **MINESWEEPER_MONGODB_URL**: MongoDB database URL.
- **MINESWEEPER_MONGODB_USER**: MongoDB database user.
- **MINESWEEPER_MONGODB_PASSWORD**: MongoDB database password.
- **VUE_APP_MINESWEEPER_API_URL**: Backend URL.

## Other commands

- Removes images, containers, and volumes.

  ```sh
  npm run stop
  ```

- Runs **stop** and **start** consecutively.

  ```sh
  npm run restart
  ```
