# Scholarx-Backend
This is the backend of the ScholarX project

## Contribution

#### Want to contribute to this project? 

[**Send us a Pull Request**](https://github.com/sef-global/scholarx-backend/issues)

Read: [Development Best Practices at SEF](https://handbook.sefglobal.org/engineering-team/team#development-best-practices)

## Prerequisites

To use this project, you need to have the following installed on your machine:

- Node.js (version 14 or later)
- npm (version 6 or later)

## Getting started

To get started, follow these steps:

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/yourusername/scholarx-backend.git
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Start the server with :

   ```bash
   npm start
   ```

4. Run Test :

   ```bash
   npm test
   ```

5. Run ESlint :

   ```bash
   npm run lint
   ```

6. Run Prettier :

   ```bash
   npm run format
   ```

7. Open your web browser and navigate to `http://localhost:3000`. 

## Project structure

Here's an overview of the project structure:

```
node-express-typescript-backend/
├── src/
│   ├── controllers/
│   │   └── index.ts
│   ├── middleware/
│   │   ├── error-handler.ts
│   │   └── logger.ts
│   ├── routes/
│   │   └── index.ts
│   ├── app.ts
│   ├── index.ts
│   └── types.ts
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

- `src/controllers/`: Contains the controller classes that handle incoming requests.
- `src/middleware/`: Contains the middleware functions that are used to modify requests and responses.
- `src/routes/`: Contains the route definitions for the application.
- `src/app.ts`: Creates and configures the Express application.
- `src/index.ts`: Starts the server.
- `src/types.ts`: Defines custom types for the application.
- `.env.example`: An example configuration file for environment variables.
- `.gitignore`: A list of files and directories that should be ignored by Git.
- `package.json`: Contains information about the project and its dependencies.
- `tsconfig.json`: Configuration file for the TypeScript compiler.
