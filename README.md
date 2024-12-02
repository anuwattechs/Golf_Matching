# GO LINK GOLF MICROSERVICE

## Overview

This is a backend application built with [Node.js](https://nodejs.org/), [TypeScript](https://www.typescriptlang.org/), and [NestJS](https://nestjs.com/). The backend handles features such as authentication, user management, logging, and database interactions.

## Table of Contents

- [GO LINK GOLF MICROSERVICE](#go-link-golf-microservice)
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Project Structure](#project-structure)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Steps](#steps)
  - [Running the Application](#running-the-application)
  - [Testing](#testing)
  - [Build for Production](#build-for-production)

## Project Structure

```bash
/project-root
│
├── /src
│   ├── /app
│   │   ├── /common              # Shared modules like utilities, services, or reusable components
│   │   │   ├── /decorators      # Custom decorators for the application
│   │   │   ├── /filters         # Exception filters for error handling
│   │   │   ├── /pipes           # Pipes for data validation or transformation
│   │   │   ├── /guards          # Guards for authorization or access control
│   │   │   └── /interceptors    # Interceptors for handling requests/responses
│   │   ├── /config              # Configuration files for settings like database config or environment variables
│   │   └── /modules             # Feature-specific modules
│   │       ├── /auth            # Authentication module
│   │       │   ├── auth.controller.ts  # Handles requests and responses for authentication
│   │       │   ├── auth.service.ts     # Manages business logic for authentication
│   │       │   ├── auth.module.ts      # Module declaration and setup for authentication
│   │       │   └── dto                # Data Transfer Objects for authentication
│   │       ├── /user                  # User module for user management
│   │       │   ├── user.controller.ts  # Manages user-related requests
│   │       │   ├── user.service.ts     # Business logic for user management
│   │       │   ├── user.module.ts      # User module setup
│   │       │   └── dto                 # Data Transfer Objects for user
│   │       ├── /other-modules          # Other feature modules
│   │
│   ├── /core                    # Core system modules like database connection and logging
│   │   ├── /database            # Database configuration and connection
│   │   │   └── database.module.ts  # Module for database management
│   │   ├── /logging             # Logging service
│   │   └── /http                # HTTP-related interceptors and error handling
│   │
│   ├── /shared                  # Shared resources across modules like models, interfaces
│   │   ├── /interfaces          # Global interfaces used throughout the application
│   │   ├── /constants           # Constants used in the application
│   │   ├── /enums               # Enumerations for selectable values in code
│   │   └── /validators          # Validators for data validation
│   │
│   ├── main.ts                  # Application entry point (bootstrap)
│   └── app.module.ts            # Root module of the application
│
├── /test                        # Test files for unit and integration testing
│   ├── /e2e                     # End-to-end tests covering full system functionality
│   ├── /unit                    # Unit tests for specific functions or modules
│   ├── jest-e2e.json            # Jest configuration for end-to-end testing
│   ├── jest-unit.json           # Jest configuration for unit testing
│
├── /scripts                     # Scripts for installation, build, and deployment
│
├── /config                      # Global configuration files (dotenv, env files)
│   ├── config.ts
│   ├── env.development          # Environment variables for development
│   ├── env.production           # Environment variables for production
│
├── package.json                 # npm package information and project configuration
├── tsconfig.json                # TypeScript configuration
└── README.md                    # Project documentation
```

## Installation

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v14+)
- **npm** (v6+)
- **MongoDB** (either locally installed or use a service like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### Steps

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```bash
   cd <project-directory>
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Set up environment variables:

   - Copy the `.env.example` file to `.env`:

     ```bash
     cp .env.example .env
     ```

   - Open the `.env` file and update the values as needed:

     ```bash
     # Example .env configuration

     NODE_ENV=development
     APP_PORT=3000
     APP_NAME="NestJS API"
     API_PREFIX=api
     APP_FALLBACK_LANGUAGE=en
     APP_HEADER_LANGUAGE=x-custom-lang
     FRONTEND_DOMAIN=http://localhost:3000
     BACKEND_DOMAIN=http://localhost:3000

     # MongoDB Configuration
     DATABASE_URL=mongodb://localhost:27017/golink_golf_db

     # File Storage Configuration
     FILE_DRIVER=local
     ACCESS_KEY_ID=
     SECRET_ACCESS_KEY=
     AWS_S3_REGION=
     AWS_DEFAULT_S3_BUCKET=

     # Email Configuration
     MAIL_HOST=maildev
     MAIL_PORT=1025
     MAIL_USER=
     MAIL_PASSWORD=
     MAIL_IGNORE_TLS=true
     MAIL_SECURE=false
     MAIL_REQUIRE_TLS=false
     MAIL_DEFAULT_EMAIL=noreply@example.com
     MAIL_DEFAULT_NAME=Api
     MAIL_CLIENT_PORT=1080

     # Authentication Configuration
     AUTH_JWT_SECRET=secret
     AUTH_JWT_TOKEN_EXPIRES_IN=15m
     AUTH_REFRESH_SECRET=secret_for_refresh
     AUTH_REFRESH_TOKEN_EXPIRES_IN=3650d
     AUTH_FORGOT_SECRET=secret_for_forgot
     AUTH_FORGOT_TOKEN_EXPIRES_IN=30m
     AUTH_CONFIRM_EMAIL_SECRET=secret_for_confirm_email
     AUTH_CONFIRM_EMAIL_TOKEN_EXPIRES_IN=1d

     # Social Media API Configuration
     FACEBOOK_APP_ID=
     FACEBOOK_APP_SECRET=
     GOOGLE_CLIENT_ID=
     GOOGLE_CLIENT_SECRET=
     GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
     APPLE_APP_AUDIENCE=[]

     TWITTER_CONSUMER_KEY=
     TWITTER_CONSUMER_SECRET=

     # Worker Configuration
     WORKER_HOST=redis://redis:6379/1
     ```

5. Set up the database:

   - Ensure your MongoDB server is running. If using a local instance, start the MongoDB service.
   - If using MongoDB Atlas, make sure your cluster is set up, and update the `DATABASE_URL` accordingly.
   - Run any initial setup scripts or seed data if applicable (you can create a script for this in the `scripts/` directory).

## Running the Application

To run the application locally:

```bash
npm run start:dev
```

This will start the server on `http://localhost:3000` (or your specified port).

## Testing

Run unit and end-to-end tests:

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e
```

## Build for Production

To build the application for production:

```bash
npm run build
```

This will compile the TypeScript files into JavaScript in the `dist/` directory, ready for production deployment.
