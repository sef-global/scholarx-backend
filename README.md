# ScholarX-Backend

![ScholarX Logo](https://sefglobal.org/assets/img/brand/scholarx.png)

Welcome to the backend of the ScholarX project!

## What is ScholarX?

ScholarX is an initiative that aims to provide free premium mentoring assistance to elite undergraduate students based in Sri Lanka. The program connects these students with Sri Lankan expatriates currently involved with some of the world's most renowned universities or Fortune 500 companies. The goal is to establish a sustainable education structure within Sri Lanka by leveraging knowledge and expertise from around the globe.

## Contribution

#### Want to contribute to this project?

We welcome contributions to make ScholarX even better! Feel free to send us a pull request with your changes or improvements. Check out our [Development Best Practices at SEF](https://handbook.sefglobal.org/engineering-team/team#development-best-practices) for guidelines.

- [**Send us a Pull Request**](https://github.com/sef-global/scholarx-backend/issues)

## Prerequisites

Before you can start using this project, make sure you have the following installed on your machine:

- Node.js (version 14 or later)
- npm (version 6 or later)

## Getting Started

Follow these steps to get started with the ScholarX backend:

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/yourusername/scholarx-backend.git
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Copy the `.env` file:

   ```bash
   cp .env.example .env
   ```

4. Replace the environment variables in the newly created `.env` file with your configuration.

5. Start the server:

   ```bash
   npm start
   ```

6. Run Tests:

   ```bash
   npm test
   ```

7. Open your web browser and navigate to `http://localhost:${server_port}` to access the running server.

## Docker Setup

If you prefer to use Docker for development, follow these steps:

1. Ensure Docker and Docker Compose are installed on your machine. You can download them from here https://www.docker.com/products/docker-desktop/.

2. Build the Docker images:

```docker-compose build```

3. Start the Docker containers:

```docker-compose up```

4. The application and its services are now running in Docker containers. You can access the application at ```http://localhost:${SERVER_PORT}```, where ```SERVER_PORT``` is the port number specified in your ```.env``` file.

5. To stop the Docker containers, use the following commnd:

```docker-compose down```

Please note that the Docker Compose setup assumes that you have a ```.env``` file in your project root. You can create one by copying the ```.env.example``` file:

```cp .env.example .env```

Then, replace the environment variables in the newly created ```.env``` file with your configuration.

The environment directive sets environment variables inside the Docker container. These variables are used to configure the PostgreSQL server. The values for ```${DB_USER}```, ```${DB_PASSWORD}```, and ```${DB_NAME}``` should be specified in your .env file.


Remember to replace ```${SERVER_PORT}``` with the actual port number if it's a fixed value. If it's specified in the ```.env``` file, you can leave it as is.


In the `docker-compose.yml` file, we also have a `db` service for the PostgreSQL database:

```dockercompose
db:
  image: postgres:15
  ports:
    - "5432:5432"
  environment:
    - POSTGRES_USER=${DB_USER}
    - POSTGRES_PASSWORD=${DB_PASSWORD}
    - POSTGRES_DB=${DB_NAME}
```

This service uses the official postgres:15 Docker image. The ports directive maps port 5432 inside the Docker container to port 5432 on your host machine, allowing you to connect to the PostgreSQL server at ```localhost:5432```.

Now, you can connect to the PostgreSQL server running inside the Docker container using a database client. Use ```localhost:5432``` as the server address, and the ```${DB_USER}```, ```${DB_PASSWORD}```, and ```${DB_NAME}``` values from your ```.env``` file for the username, password, and database name, respectively.

### Note 

If you have a local PostgreSQL server running on port 5432, you will need to stop it before starting the Docker container, or change the port mapping to avoid a conflict.


Remember to replace ```${SERVER_PORT}``` with the actual port number if it's a fixed value. If it's specified in the ```.env``` file, you can leave it as is.

---

#### Code Quality

We strive to maintain a high code quality. You can check for linting issues by running:

```bash
npm run lint
```

And to automatically format the code, use:

```bash
npm run format
```

## Project Structure

Here's an overview of the project structure:

```
scholarx-backend/
├── src/
│   ├── controllers/
│   │   └── index.ts
│   ├── middleware/
│   │   └── index.ts
│   ├── routes/
│   │   └── index.ts
│   ├── services/
│   │   └── auth.service.ts
│   ├── entities/
│   │   └── profile.entity.ts
│   ├── index.ts
│   └── types.ts
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

- `src/controllers/`: Contains the controller classes that handle incoming requests.
- `src/middleware/`: Contains the middleware functions used to modify requests and responses.
- `src/routes/`: Contains the route definitions for the application.
- `src/services/`: Contains the service definitions for the application.
- `src/entities/`: Contains the entity models for the application.
- `src/index.ts`: Creates and configures the Express application and starts the server.
- `src/types.ts`: Defines custom types for the application.
- `.env.example`: An example configuration file for environment variables.
- `.gitignore`: A list of files and directories to be ignored by Git.
- `package.json`: Contains information about the project and its dependencies.
- `tsconfig.json`: Configuration file for the TypeScript compiler.

We appreciate your interest in ScholarX. Happy contributing! If you have any questions or need assistance, please don't hesitate to reach out to us.