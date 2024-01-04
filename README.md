## Squary - Backend

The backend service for Squary, providing the necessary API endpoints and database operations to power the frontend application for shared expenses management using cryptocurrency and multisig technology.

## Related Repositories
- Frontend: [Squary Frontend Repository](https://github.com/fabian416/squary_front)
- Contract: [Squary Smart Contract Repository](https://github.com/fabian416/SquaryContract)

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Database Setup](#Database_Setup)
4. [Running The Project](#Running-the-project)
5. [API Endpoints](#API-Endpoints)
6. [Contribution Guidelines](#Contribution-Guidelines)
7. [Dependencies](#Dependencies)
8. [License](#License)

## Prerequisites
Node.js (v16.20.2)
npm or yarn
PostgreSQL
Access to the frontend repository, if needed, and its setup instructions

## Installation
1. git clone https://github.com/fabian416/Squary_back.git
2. cd Squary_back
3. npm install

## Database Setup
1. Ensure you have PostgreSQL installed and running.
2. Set up your database and make a note of the credentials.
3. Create a .env file in the root of your project, and provide your database connection details.

## Dependencies

The following dependencies are required to run this project:

- `@gnosis.pm/safe-core-sdk`: SDK for Gnosis Safe.
- `@safe-global/api-kit`: A kit for integrating with the Safe Global API.
- `@safe-global/protocol-kit`: A kit for handling Safe Global protocols.
- `@safe-global/safe-core-sdk-types`: Types for the Safe Core SDK.
- `axios`: For making HTTP requests.
- `bcrypt`: For hashing passwords.
- `cors`: Middleware to enable CORS.
- `dotenv`: To load environment variables from `.env` file.
- `ethers`: Ethereum wallet implementation and utilities.
- `express`: Web framework for Node.js.
- `jest`: JavaScript testing framework.
- `mongoose`: MongoDB object modeling tool.
- `morgan`: HTTP request logger middleware.
- `pg`: Non-blocking PostgreSQL client.
- `prettier`: Code formatter.
- `reflect-metadata`: Allows defining and reading metadata for TypeScript decorators.
- `socket.io`: Enables real-time bidirectional event-based communication.
- `ts-jest`: A Jest transformer with source map support that lets you use Jest to test projects written in TypeScript.
- `ts-node`: TypeScript execution engine and REPL for Node.js.
- `typedi`: Dependency injection tool for TypeScript.
- `typeorm-typedi-extensions`: Extensions for TypeORM and typedi.
- `typeorm`: ORM for TypeScript and JavaScript.
- `typescript`: Language for application-scale JavaScript.

## DevDependencies

These are the development dependencies:

- `@types/bcrypt`: TypeScript types for bcrypt.
- `@types/cors`: TypeScript types for cors.
- `@types/dotenv`: TypeScript types for dotenv.
- `@types/express`: TypeScript types for Express.
- `@types/jest`: TypeScript types for Jest.
- `@types/mongoose`: TypeScript types for Mongoose.
- `@types/morgan`: TypeScript types for Morgan.
- `@types/node`: TypeScript types for Node.js.
- `@types/pg`: TypeScript types for PostgreSQL.
- `@types/socket.io`: TypeScript types for Socket.IO.


## Running The Project

To get the Squary backend up and running on your local environment, follow these steps:

1. **Clone the Repository**
This will clone the `squary_back` repository to your machine.

2. **Navigate to the Project Directory**
Enter the cloned repository.

3. **Install Dependencies**
This command installs all the necessary dependencies.

4. **Set Up the Database**
Make sure PostgreSQL is installed and running on your machine. Then, set up your database and note down the credentials. You'll need to create a `.env` file in the root of the project and fill it with your database connection details, like this:
"DATABASE_URL=your_database_url_here"

5. **Start the Backend Server**
npm start
This command will start the server. By default, it usually runs on port 3000.

6. **Verify the Server is Running**
Open `http://localhost:3000` in your browser or use a tool like Postman to test the API endpoints. You should see a response indicating that the server is running successfully.

For the complete functionality of Squary, you should also set up and run the [Squary Frontend Repository](https://github.com/fabian416/squary_front). Ensure you follow the setup instructions provided in its README as well.

## API Endpoints
[detalles de los puntos finales de la API]

## Contribution Guidelines
[instrucciones para contribuir al proyecto]

## License

This project is licensed under the MIT License - 
