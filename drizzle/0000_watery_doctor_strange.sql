DO $$ BEGIN
 CREATE TYPE "public"."checkoutSessionMode" AS ENUM('payment', 'subscription', 'setup');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."checkoutSessionPaymentStatus" AS ENUM('unpaid', 'paid', 'no_payment_required');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."checkoutSessionStatus" AS ENUM('open', 'complete', 'expired');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."invoiceStatus" AS ENUM('draft', 'open', 'paid', 'uncollectible', 'void');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."paymentIntentStatus" AS ENUM('requires_payment_method', 'requires_confirmation', 'requires_action', 'processing', 'requires_capture', 'canceled', 'succeeded');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."pricingPlanInterval" AS ENUM('day', 'week', 'month', 'year');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."pricingType" AS ENUM('recurring', 'one_time');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."role" AS ENUM('admin', 'user');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."subscriptionStatus" AS ENUM('trialing', 'active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'unpaid', 'paused');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "authenticator" (
	"credentialID" text NOT NULL,
	"userId" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"credentialPublicKey" text NOT NULL,
	"counter" integer NOT NULL,
	"credentialDeviceType" text NOT NULL,
	"credentialBackedUp" boolean NOT NULL,
	"transports" text,
	CONSTRAINT "authenticator_userId_credentialID_pk" PRIMARY KEY("userId","credentialID"),
	CONSTRAINT "authenticator_credentialID_unique" UNIQUE("credentialID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "checkoutSession" (
	"id" text PRIMARY KEY NOT NULL,
	"amountTotal" integer,
	"amountSubtotal" integer,
	"created" timestamp DEFAULT now() NOT NULL,
	"mode" "checkoutSessionMode" NOT NULL,
	"paymentIntentId" text,
	"paymentStatus" "checkoutSessionPaymentStatus" NOT NULL,
	"status" "checkoutSessionStatus" NOT NULL,
	"subscriptionId" text,
	"userId" text NOT NULL,
	"priceId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customer" (
	"userId" text NOT NULL,
	"stripeCustomerId" text NOT NULL,
	CONSTRAINT "customer_userId_stripeCustomerId_pk" PRIMARY KEY("userId","stripeCustomerId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invoice" (
	"id" text PRIMARY KEY NOT NULL,
	"amountDue" integer NOT NULL,
	"amountPaid" integer NOT NULL,
	"amountRemaining" integer NOT NULL,
	"created" timestamp DEFAULT now() NOT NULL,
	"hostedInvoiceUrl" text,
	"invoiceNumber" text,
	"invoicePdf" text,
	"paymentIntentId" text,
	"status" "invoiceStatus" NOT NULL,
	"subscriptionId" text,
	"userId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "paymentIntent" (
	"id" text PRIMARY KEY NOT NULL,
	"amount" integer NOT NULL,
	"created" timestamp DEFAULT now() NOT NULL,
	"description" text,
	"status" "paymentIntentStatus" NOT NULL,
	"userId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "paymentMethod" (
	"id" text PRIMARY KEY NOT NULL,
	"brand" text NOT NULL,
	"created" timestamp DEFAULT now() NOT NULL,
	"expMonth" integer NOT NULL,
	"expYear" integer NOT NULL,
	"last4" text NOT NULL,
	"userId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "price" (
	"id" text PRIMARY KEY NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"currency" text NOT NULL,
	"description" text,
	"interval" "pricingPlanInterval",
	"intervalCount" integer,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"productId" text NOT NULL,
	"type" "pricingType" NOT NULL,
	"unitAmount" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product" (
	"id" text PRIMARY KEY NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"description" text,
	"image" text,
	"marketingFeatures" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subscription" (
	"id" text PRIMARY KEY NOT NULL,
	"cancelAt" timestamp,
	"canceledAt" timestamp,
	"cancelAtPeriodEnd" boolean NOT NULL,
	"created" timestamp DEFAULT now() NOT NULL,
	"currentPeriodEnd" timestamp DEFAULT now() NOT NULL,
	"currentPeriodStart" timestamp DEFAULT now() NOT NULL,
	"userId" text NOT NULL,
	"description" text,
	"endedAt" timestamp,
	"priceId" text NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"status" "subscriptionStatus" NOT NULL,
	"trialEnd" timestamp,
	"trialStart" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"emailVerified" timestamp,
	"image" text,
	"role" "role" DEFAULT 'user' NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "authenticator" ADD CONSTRAINT "authenticator_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "checkoutSession" ADD CONSTRAINT "checkoutSession_paymentIntentId_paymentIntent_id_fk" FOREIGN KEY ("paymentIntentId") REFERENCES "public"."paymentIntent"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "checkoutSession" ADD CONSTRAINT "checkoutSession_subscriptionId_subscription_id_fk" FOREIGN KEY ("subscriptionId") REFERENCES "public"."subscription"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "checkoutSession" ADD CONSTRAINT "checkoutSession_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "checkoutSession" ADD CONSTRAINT "checkoutSession_priceId_price_id_fk" FOREIGN KEY ("priceId") REFERENCES "public"."price"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customer" ADD CONSTRAINT "customer_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoice" ADD CONSTRAINT "invoice_paymentIntentId_paymentIntent_id_fk" FOREIGN KEY ("paymentIntentId") REFERENCES "public"."paymentIntent"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoice" ADD CONSTRAINT "invoice_subscriptionId_subscription_id_fk" FOREIGN KEY ("subscriptionId") REFERENCES "public"."subscription"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoice" ADD CONSTRAINT "invoice_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "paymentIntent" ADD CONSTRAINT "paymentIntent_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "paymentMethod" ADD CONSTRAINT "paymentMethod_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "price" ADD CONSTRAINT "price_productId_product_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."product"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subscription" ADD CONSTRAINT "subscription_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subscription" ADD CONSTRAINT "subscription_priceId_price_id_fk" FOREIGN KEY ("priceId") REFERENCES "public"."price"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
