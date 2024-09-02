# Welcome to StartStack!

This is the quick-start guide for StartStack. Click here for all the [docs](https://www.startstack.io/docs).

## Prerequisites

- Node.js (v20 or later)
- pnpm (v9)
- A PostgreSQL database provider (Supabase or Vercel Postgres)
- A Stripe account
- A Resend account

## Running Locally

1. Clone the repository:

```bash
git clone https://github.com/startstack-io/startstack.git
cd startstack
```

2. Install dependencies:

```bash
pnpm install
```

## Environment Variables

Create a `.env` file in the root of your project you can use the `.env.example` file to get started:

```bash
cp .env.example .env
```

## Setup your database

### Supabase

1.  Sign up for a [Supabase](https://supabase.io/) account and create a new project.
2.  Follow the [instructions](https://supabase.com/docs/guides/database/connecting-to-postgres/serverless-drivers) to manually setup a connection string for serverless.
3.  Update the connection string in your `.env` file.

```bash
POSTGRES_URL="postgres://postgres.cfcxynqnhdybqtbhjemm:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?workaround=supabase-pooler.vercel"
```

Don't forget to add your password to the connection string.
Alternatively you can use the [Vercel Supabase integration](https://vercel.com/marketplace/supabase) to setup your database.

### Vercel Postgres

1. Create a new Postgres database in Vercel Storage. A `POSTGRES_URL` env will be set in your project.
2. Update the connection string in your `.env` file.

```bash
POSTGRES_URL="postgresql://{username}:{password}@{host}:{port}/{database}"
```

> **Note:** We recommend having a dedicated database for development and another for production. This allows you to make changes to the database schema without affecting the production database while developing locally.

### Run the database migrations:

```bash
pnpm run db:migrate
```

> **Note:** This will create the tables in your database.

## Running the Application

Once you have a database setup and the migrations have been run, you can start the development server:

```bash
pnpm dev
```

Open your browser and navigate to `http://localhost:3000`.

## Configuring NextAuth

## Generate a new secret key

```bash
openssl rand -base64 32
```

Update the `AUTH_SECRET` in your `.env` file.

```bash
AUTH_SECRET="YOUR-SECRET-KEY"
```

## Configure authentication provider(s)

### Email Provider (Resend) [Magic Link]

1. Sign up for a [Resend](https://resend.com/).
2. Make sure you have properly setup your [domain and verified it](https://resend.com/domains).
3. Create a API key in your [Resend dashboard](https://resend.com/api-keys).
4. Update the `RESEND_API_KEY` in your `.env` file.

```bash
RESEND_API_KEY="YOUR-API-KEY"
```

5. Update the `AUTH_EMAIL_FROM` in your `.env` file.

```bash
AUTH_EMAIL_FROM="Acme <signin@example.com>"
```

6. Navigate to http://localhost:3000/sign-in and you should see the email provider option. Go ahead and sign up. You should receive an email with a sign in link.

> **Note:** Full documentation on setting up resend can be found [here](https://www.startstack.io/docs/resend).

### Google OAuth

1. Sign up for a [Google Cloud](https://cloud.google.com/) account and create a new project.
2. Enable the "Google+ API" and "Google Workspace API" for your project.
3. Create a new OAuth client ID and secret for your project.
4. Update the `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` in your `.env` file.

```bash
AUTH_GOOGLE_ID="YOUR-CLIENT-ID"
AUTH_GOOGLE_SECRET="YOUR-CLIENT-SECRET"
```

5. Navigate to http://localhost:3000/sign-in and you should see an option to login with Google.

> **Note:** Full documentation on setting up Google OAuth can be found [here](https://www.startstack.io/docs/google-oauth).

## Give your user the admin role

## Available Commands

- `pnpm dev`: Starts the development server.
- `pnpm build`: Builds the application for production.
- `pnpm start`: Starts the production server.
- `pnpm lint`: Runs ESLint to check for linting errors.
- `pnpm db:migrate`: Runs database migrations.
