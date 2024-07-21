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

- Node.js (version 18 or later)
- npm (version 9 or later)

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

`docker-compose build`

3. Start the Docker containers:

`docker-compose up`

4. The application and its services are now running in Docker containers. You can access the application at `http://localhost:${SERVER_PORT}`, where `SERVER_PORT` is the port number specified in your `.env` file.

5. To stop the Docker containers, use the following commnd:

`docker-compose down`

Please note that the Docker Compose setup assumes that you have a `.env` file in your project root. You can create one by copying the `.env.example` file:

`cp .env.example .env`

Then, replace the environment variables in the newly created `.env` file with your configuration.

The environment directive sets environment variables inside the Docker container. These variables are used to configure the PostgreSQL server. The values for `${DB_USER}`, `${DB_PASSWORD}`, and `${DB_NAME}` should be specified in your .env file.

Remember to replace `${SERVER_PORT}` with the actual port number if it's a fixed value. If it's specified in the `.env` file, you can leave it as is.

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

This service uses the official postgres:15 Docker image. The ports directive maps port 5432 inside the Docker container to port 5432 on your host machine, allowing you to connect to the PostgreSQL server at `localhost:5432`.

Now, you can connect to the PostgreSQL server running inside the Docker container using a database client. Use `localhost:5432` as the server address, and the `${DB_USER}`, `${DB_PASSWORD}`, and `${DB_NAME}` values from your `.env` file for the username, password, and database name, respectively.

### Note

If you have a local PostgreSQL server running on port 5432, you will need to stop it before starting the Docker container, or change the port mapping to avoid a conflict.

Remember to replace `${SERVER_PORT}` with the actual port number if it's a fixed value. If it's specified in the `.env` file, you can leave it as is.

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

## Setting up Google Authentication

1. Open Google Cloud Console:

Visit https://console.cloud.google.com

2. Sign In:

Sign in with your Google account. If you don't have one, you'll need to create one.

3. Navigate to the Project Selection Page:

Once signed in, you'll be directed to the Google Cloud Console. At the top left of the page, you'll see a drop-down menu with text "Select a Project". Click on this menu.

4. Create a New Project:

If you have existing projects, you can select one or click on the "New Project" button.

5. Enter Project Details:

In the "Project Name" field, give your project a unique name. Then select a location (region) for your project's resources.

6. Click "Create":

Once the details are filled, click the "Create" button at the bottom.

7. Wait for Project Creation:

Google Cloud Platform will now create your project. This might take a few moments.

## Enabling Google+ API for the Project

1. Navigate to the Google Cloud Console.
   Select your project using the project selector at the top.
   In the left navigation pane, click on "APIs & Services" and then click on "Library."

2. Search for "Google+ API" in the library.

3. Click on the Google+ API and then click the "Enable" button.

## Create OAuth Consent Screen

1. Navigate to the API & Services Dashboard:
   Open the Google Cloud Console.
   Select your project.

2. Open the API & Services Dashboard:

In the left navigation pane, click on "APIs & Services" and then click on "Credentials."

4. Configure Consent Screen:

Click on "Create Credentials" and choose "OAuth consent screen."
Fill in the required details for your OAuth consent screen, such as product name, user support email, and developer contact information.

5. Save and Continue:
   Save the consent screen configuration.

## Create OAuth Client ID Credentials

1. Navigate to the API & Services Dashboard:
   In the "Credentials" page, click on "Create Credentials" and choose "OAuth client ID."
   Configure OAuth Client ID:
   Select the application type and
   Enter a name for your client ID.
   Configure the authorized redirect URIs.

2. Save Credentials:

Click "Create" to generate your OAuth client ID and client secret.

## Set Environment Variables

After obtaining the OAuth client ID and client secret,set the environment variables in your application to use these credentials.

Ex:

process.env.GOOGLE_CLIENT_ID = 'your-client-id';
process.env.GOOGLE_CLIENT_SECRET = 'your-client-secret';
process.env.GOOGLE_REDIRECT_URL = 'your-redirect-uri';

We appreciate your interest in ScholarX. Happy contributing! If you have any questions or need assistance, please don't hesitate to reach out to us.

## Setting up LinkedIn Authentication

1. Create LinkedIn page with the mandatory information.

2. Navigate to https://developer.linkedin.com/

3. Select "Create App":

   - Add App name.
   - Search for the LinkedIn page that was previously created.
   - Upload an image as a Logo.
   - Create the App.

4. In Products section select `Share on LinkedIn` and `Sign In with LinkedIn using OpenID Connect` request access.

5. In Auth section edit the `Authorized redirect URLs for your app` and add the redirect url. `http://localhost:3000/api/auth/linkedin/callback`

6. Copy Client Id and Client Secret from the Auth Section.

7. In setting section verify the LinkedIn Page and generate URL.

8. Verify it from your account.

## Create dummy data

1. Run the seeding script:

   ```bash
   npm run seed
   ```
