# Welcome to StartStack!

Click here for all the [docs](https://www.startstack.io/docs).

## Prerequisites

- Node.js (v20 or later)
- pnpm (v9)
- A Postgres database provider (we recommend Supabase or Vercel Postgres)
- A Stripe account
- A Resend account (used for newsletter, and email sign-in / sign-up)

## Optionally

- Posthog (for analytics)
- Sentry (for error handling)
- Google Cloud Account (for Google OAuth)

## Running Locally

1. Clone the repository:

```bash
git clone https://github.com/collinschaafsma/startstack.git
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

### Supabase (Recommended)

1. Sign up for a [Supabase](https://supabase.com) account and create a new project.
2. Click the `Connect` button to view your connection string.
3. Update the connection string in your `.env` file.

```bash
POSTGRES_URL="<your-connection-string>?workaround=supabase-pooler.vercel"
```

> **Note:** Notice how the connection string has a `?workaround=supabase-pooler.vercel` at the end. This is required when deploying to Vercel. See [docs](https://supabase.com/docs/guides/database/connecting-to-postgres/serverless-drivers). Don't forget to add your password to the connection string.

Alternatively you can use the [Vercel Supabase integration](https://vercel.com/marketplace/supabase) to setup your database.

### Vercel Postgres

1. Create a new Postgres database in Vercel Storage. A `POSTGRES_URL` env will be set in your project.
2. Update the connection string in your `.env` file.

```bash
POSTGRES_URL="<your-connection-string>"
```

> **Note:** We recommend having a dedicated database for development and another for production. This allows you to make changes to the database schema without affecting the production database while developing locally. Or better yet, checkout Supabase database [branching](https://supabase.com/docs/guides/platform/branching) for your vercel preview deployments!

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

## Configuring Auth

### Generate a new secret key

```bash
openssl rand -base64 32
```

Update the `AUTH_SECRET` in your `.env` file.

```bash
AUTH_SECRET="YOUR-SECRET-KEY"
```

> **Note:** Make sure you generate different keys for all of your environments!

### Configure authentication provider(s)

#### Email Provider (Resend) [Magic Link]

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

6. Navigate to http://localhost:3000/sign-up and you should see the email provider option. Go ahead and sign up. You should receive an email with a sign in link.

> **Note:** Full documentation on setting up resend can be found [here](https://www.startstack.io/docs/guides/email-delivery).

#### Google OAuth

1. See: [Using OAuth 2.0 to Access Google APIs](https://developers.google.com/identity/protocols/oauth2)
2. See: [Configuring a client app](https://console.cloud.google.com/apis/credentials)
3. Update the `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` in your `.env` file.

```bash
AUTH_GOOGLE_ID="YOUR-CLIENT-ID"
AUTH_GOOGLE_SECRET="YOUR-CLIENT-SECRET"
```

5. Navigate to http://localhost:3000/sign-up and you should see an option to login with Google.

> **Note:** Full documentation on setting up Google OAuth can be found [here](https://www.startstack.io/docs/guides/authentication#google-provider).

## Grant your user the admin role

```bash
pnpm grant:admin:role your-email@example.com
```

> **Note:** This will grant the user the admin role in the database based on your local `POSTGRES_URL` env var. You can also edit the user table in the database directly using the Supabase Table Editor or any other db editor like Postico etc.

## Setup Stripe

1. Sign up for a [Stripe](https://stripe.com/) account.
2. Note your publishable key and secret key from your [Stripe dashboard](https://dashboard.stripe.com/test/apikeys).
3. Update the `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` and `STRIPE_SECRET_KEY` in your `.env` file.

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="YOUR-PUBLISHABLE-KEY"
STRIPE_SECRET_KEY="YOUR-SECRET-KEY"
```

> **Note:** Make sure you set your production keys in Vercel based on the live Stripe environment.

4. Authenticate the Stripe CLI with your Stripe account, if you have multiple projects make sure you select the correct one:

```bash
pnpm stripe:login
```

5. Start the dev server

```bash
pnpm dev
```

> **Note:** Make sure you don't have the coming soon page enabled locally in your `.env` file.

```bash
NEXT_PUBLIC_ENABLE_COMING_SOON="false"
```

6. Listen for webhooks

```bash
pnpm stripe:listen
```

7. Note the webhook secret returned by the CLI and update the `STRIPE_WEBHOOK_SECRET` in your `.env` file.

```bash
STRIPE_WEBHOOK_SECRET="YOUR-WEBHOOK-SECRET"
```

8. Create a new product & price in your [Stripe dashboard](https://dashboard.stripe.com/test/products). You should see your product on the home page. You can also verify your data in your database. Use the Supabase Table Editor or run the following command to connect to your database using drizzle studio:

```bash
pnpm db:studio
```

> **Note:** You must agree to Stripe's terms of service if you have enabled consent_collection (default) [here](https://dashboard.stripe.com/settings/).

## Setup Newsletter Audience

1. Login to [Resend](https://resend.com/) and navigate to your account.
2. Click on `Audiences` and create a new audience.
3. Copy the audience id and update the `RESEND_NEWSLETTER_AUDIENCE_ID` in your `.env` file.

```bash
RESEND_NEWSLETTER_AUDIENCE_ID="YOUR-AUDIENCE-ID"
```

## Setup PostHog (Optional)

1. Sign up for a [PostHog](https://posthog.com/) account.
2. Create a new project and click on `Settings`.
3. You will see a code snippet that looks like this:

```js
<script>
    ... omitted ...
    posthog.init('<YOUR-POSTHOG-KEY>',{api_host:'<YOUR-POSTHOG-HOST>', person_profiles: 'identified_only')
</script>
```

4. Update the `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` in your `.env` file.

```bash
NEXT_PUBLIC_POSTHOG_KEY="<YOUR-POSTHOG-KEY>"
NEXT_PUBLIC_POSTHOG_HOST="<YOUR-POSTHOG-HOST>"
```

## Setup Sentry (Optional)

1. Sign up for a [Sentry](https://sentry.io/) account.
2. Click on `Settings`. Note the `Organization Slug`.
3. Update the `SENTRY_ORG` in your `.env` file.

```bash
SENTRY_ORG="<YOUR-ORGANIZATION-SLUG>"
```

4. Create a new project and note the `Project Name`.
5. Update the `SENTRY_PROJECT` in your `.env` file.

```bash
SENTRY_PROJECT="<YOUR-PROJECT-NAME>"
```

6. Create a new auth token. Click `Settings` -> `Auth Tokens` -> `Create Auth Token`.
7. Update the `SENTRY_AUTH_TOKEN` in your `.env` file.

```bash
SENTRY_AUTH_TOKEN="<YOUR-AUTH-TOKEN>"
```

8. Create a new client key. Click `Settings` -> `Client Keys` copy the DSN or `Generate New Key`.
9. Update the `NEXT_PUBLIC_SENTRY_DSN` in your `.env` file.

```bash
NEXT_PUBLIC_SENTRY_DSN="<YOUR-DSN>"
```

> **Note:** Full documentation on error handling can be found [here](https://www.startstack.io/docs/guides/error-handling).
