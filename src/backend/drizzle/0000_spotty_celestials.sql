-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE IF NOT EXISTS "alembic_version" (
	"version_num" varchar(32) PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_metas" (
	"user_id" integer NOT NULL,
	"data_key" varchar NOT NULL,
	"data_value" varchar,
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP) NOT NULL,
	"updated_at" timestamp with time zone DEFAULT timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invoices" (
	"download_url" varchar NOT NULL,
	"user_id" integer NOT NULL,
	"last_downloaded" timestamp with time zone,
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP) NOT NULL,
	"updated_at" timestamp with time zone DEFAULT timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "wallets" (
	"user_id" integer NOT NULL,
	"qty_g" double precision NOT NULL,
	"product_name" varchar NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP) NOT NULL,
	"updated_at" timestamp with time zone DEFAULT timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gold24_prices" (
	"product_id" varchar NOT NULL,
	"product_name" varchar NOT NULL,
	"source" varchar NOT NULL,
	"price_w_gst" double precision NOT NULL,
	"price_wo_gst" double precision NOT NULL,
	"applied_gst" double precision NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP) NOT NULL,
	"updated_at" timestamp with time zone DEFAULT timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP),
	"aura_buy_price" double precision,
	"aura_sell_price" double precision,
	"src_price_w_gst" double precision,
	"src_price_wo_gst" double precision
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transactions" (
	"uuid" varchar NOT NULL,
	"invoice_id" integer,
	"user_id" integer NOT NULL,
	"qty_g" double precision NOT NULL,
	"value_wo_gst_rs" double precision NOT NULL,
	"gst_rs" double precision NOT NULL,
	"total_value_rs" double precision NOT NULL,
	"txn_status" varchar NOT NULL,
	"txn_type" varchar NOT NULL,
	"txn_subtype" varchar NOT NULL,
	"product_name" varchar NOT NULL,
	"platform" varchar NOT NULL,
	"version" varchar,
	"show_in_app" boolean NOT NULL,
	"attached_coupon_code" varchar,
	"discount_rs" double precision,
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP) NOT NULL,
	"updated_at" timestamp with time zone DEFAULT timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP),
	"rate_per_g_wo_gst" double precision NOT NULL,
	"payment_mode" varchar,
	"external_txn_id" varchar,
	"meta_data" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mandate_transactions" (
	"mandate_id" integer NOT NULL,
	"status" varchar NOT NULL,
	"meta_data" jsonb,
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT timezone('Asia/Kolkata'::text, now()) NOT NULL,
	"updated_at" timestamp with time zone,
	"execution_ref" varchar,
	"txn_no" varchar NOT NULL,
	"bank_rrn" varchar NOT NULL,
	"notification_id" bigint NOT NULL,
	CONSTRAINT "mandate_transactions_txn_no_key" UNIQUE("txn_no")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"first_name" varchar NOT NULL,
	"middle_name" varchar,
	"last_name" varchar,
	"country_code" varchar NOT NULL,
	"phone_number" varchar NOT NULL,
	"display_name" varchar,
	"email" varchar,
	"jwt_token" varchar,
	"last_login" timestamp with time zone DEFAULT timezone('utc'::text, CURRENT_TIMESTAMP) NOT NULL,
	"is_active" boolean,
	"last_platform" varchar NOT NULL,
	"current_app_version" varchar NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP) NOT NULL,
	"updated_at" timestamp with time zone DEFAULT timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP),
	"email_verified" boolean,
	"dob" varchar,
	"partner_id" integer,
	"kyc_verified" boolean,
	"pin" varchar,
	"biometric" boolean
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "partners" (
	"username" varchar NOT NULL,
	"password" varchar NOT NULL,
	"api_key" varchar NOT NULL,
	"is_active" boolean,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"plan" varchar,
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP) NOT NULL,
	"updated_at" timestamp with time zone DEFAULT timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP),
	CONSTRAINT "partners_username_key" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_kyc_details" (
	"kyc_verified_on" timestamp with time zone DEFAULT timezone('utc'::text, CURRENT_TIMESTAMP) NOT NULL,
	"kyc_verified_by" varchar NOT NULL,
	"kyc_data" jsonb,
	"kyc_number" varchar NOT NULL,
	"user_id" integer NOT NULL,
	"kyc_request_id" varchar,
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP) NOT NULL,
	"updated_at" timestamp with time zone DEFAULT timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mandates" (
	"user_id" integer NOT NULL,
	"amount" double precision NOT NULL,
	"recurrence" varchar,
	"recur_day" varchar,
	"recur_date" integer,
	"attached_vpa_id" varchar,
	"mandate_ref" varchar NOT NULL,
	"start_date" varchar NOT NULL,
	"end_date" varchar NOT NULL,
	"status" varchar NOT NULL,
	"pattern" varchar NOT NULL,
	"meta_data" jsonb,
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP) NOT NULL,
	"updated_at" timestamp with time zone DEFAULT timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP),
	"bank_id" integer,
	"txn_no" varchar NOT NULL,
	"last_success_notify_date" timestamp with time zone,
	"last_success_execution_date" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "webhook_logs" (
	"vendor" varchar NOT NULL,
	"server_response_code" integer,
	"request_data" jsonb,
	"headers" varchar,
	"error" varchar,
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT timezone('Asia/Kolkata'::text, now()) NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vendor_api_logs" (
	"user_id" bigint,
	"vendor" varchar NOT NULL,
	"encrypted_request_data" jsonb,
	"request_data" jsonb,
	"headers" varchar,
	"request_id" integer,
	"response_data" jsonb,
	"encrypted_response_data" jsonb,
	"response_code" integer,
	"url" varchar,
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT timezone('Asia/Kolkata'::text, now()) NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_banks" (
	"user_id" integer NOT NULL,
	"bank_name" varchar NOT NULL,
	"account_number" varchar NOT NULL,
	"ifsc_code" varchar NOT NULL,
	"account_type" varchar NOT NULL,
	"account_holder_name" varchar NOT NULL,
	"vpa" varchar NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP) NOT NULL,
	"updated_at" timestamp with time zone DEFAULT timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mandate_notifications" (
	"mandate_id" integer NOT NULL,
	"status" varchar NOT NULL,
	"meta_data" jsonb,
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT timezone('Asia/Kolkata'::text, now()) NOT NULL,
	"updated_at" timestamp with time zone,
	"seq_no" varchar NOT NULL,
	"expected_execution_date" timestamp with time zone,
	CONSTRAINT "mandate_notifications_mandate_id_seq_no_key" UNIQUE("mandate_id","seq_no")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ix_user_metas_id" ON "user_metas" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ix_invoices_id" ON "invoices" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ix_wallets_id" ON "wallets" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ix_gold24_prices_id" ON "gold24_prices" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ix_transactions_id" ON "transactions" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ix_transactions_txn_status" ON "transactions" ("txn_status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ix_transactions_txn_subtype" ON "transactions" ("txn_subtype");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ix_transactions_txn_type" ON "transactions" ("txn_type");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ix_transactions_uuid" ON "transactions" ("uuid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ix_mandate_transactions_id" ON "mandate_transactions" ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ix_users_email" ON "users" ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ix_users_id" ON "users" ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ix_users_phone_number" ON "users" ("phone_number");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ix_partners_id" ON "partners" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ix_user_kyc_details_id" ON "user_kyc_details" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ix_user_kyc_details_kyc_number" ON "user_kyc_details" ("kyc_number");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ix_mandates_id" ON "mandates" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ix_webhook_logs_id" ON "webhook_logs" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ix_vendor_api_logs_id" ON "vendor_api_logs" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ix_user_banks_id" ON "user_banks" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ix_mandate_notifications_id" ON "mandate_notifications" ("id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_metas" ADD CONSTRAINT "user_metas_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoices" ADD CONSTRAINT "invoices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wallets" ADD CONSTRAINT "wallets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mandate_transactions" ADD CONSTRAINT "mandate_transactions_mandate_id_fkey" FOREIGN KEY ("mandate_id") REFERENCES "mandates"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mandate_transactions" ADD CONSTRAINT "mandate_transactions_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "mandate_notifications"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "partners"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_kyc_details" ADD CONSTRAINT "user_kyc_details_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mandates" ADD CONSTRAINT "mandates_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mandates" ADD CONSTRAINT "mandates_bank_id_fkey" FOREIGN KEY ("bank_id") REFERENCES "user_banks"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_banks" ADD CONSTRAINT "user_banks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mandate_notifications" ADD CONSTRAINT "mandate_notifications_mandate_id_fkey" FOREIGN KEY ("mandate_id") REFERENCES "mandates"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

*/