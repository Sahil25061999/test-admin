import { pgTable, varchar, index, foreignKey, integer, serial, timestamp, doublePrecision, uniqueIndex, boolean, jsonb, unique, bigint } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"



export const alembicVersion = pgTable("alembic_version", {
	versionNum: varchar("version_num", { length: 32 }).primaryKey().notNull(),
});

export const userMetas = pgTable("user_metas", {
	userId: integer("user_id").notNull().references(() => users.id),
	dataKey: varchar("data_key").notNull(),
	dataValue: varchar("data_value"),
	id: serial("id").primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP)`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP)`),
},
(table) => {
	return {
		ixUserMetasId: index("ix_user_metas_id").on(table.id),
	}
});

export const invoices = pgTable("invoices", {
	downloadUrl: varchar("download_url").notNull(),
	userId: integer("user_id").notNull().references(() => users.id),
	lastDownloaded: timestamp("last_downloaded", { withTimezone: true, mode: 'string' }),
	id: serial("id").primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP)`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP)`),
},
(table) => {
	return {
		ixInvoicesId: index("ix_invoices_id").on(table.id),
	}
});

export const wallets = pgTable("wallets", {
	userId: integer("user_id").notNull().references(() => users.id),
	qtyG: doublePrecision("qty_g").notNull(),
	productName: varchar("product_name").notNull(),
	id: serial("id").primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP)`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP)`),
},
(table) => {
	return {
		ixWalletsId: index("ix_wallets_id").on(table.id),
	}
});

export const gold24Prices = pgTable("gold24_prices", {
	productId: varchar("product_id").notNull(),
	productName: varchar("product_name").notNull(),
	source: varchar("source").notNull(),
	priceWGst: doublePrecision("price_w_gst").notNull(),
	priceWoGst: doublePrecision("price_wo_gst").notNull(),
	appliedGst: doublePrecision("applied_gst").notNull(),
	id: serial("id").primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP)`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP)`),
	auraBuyPrice: doublePrecision("aura_buy_price"),
	auraSellPrice: doublePrecision("aura_sell_price"),
	srcPriceWGst: doublePrecision("src_price_w_gst"),
	srcPriceWoGst: doublePrecision("src_price_wo_gst"),
},
(table) => {
	return {
		ixGold24PricesId: index("ix_gold24_prices_id").on(table.id),
	}
});

export const transactions = pgTable("transactions", {
	uuid: varchar("uuid").notNull(),
	invoiceId: integer("invoice_id").references(() => invoices.id),
	userId: integer("user_id").notNull().references(() => users.id),
	qtyG: doublePrecision("qty_g").notNull(),
	valueWoGstRs: doublePrecision("value_wo_gst_rs").notNull(),
	gstRs: doublePrecision("gst_rs").notNull(),
	totalValueRs: doublePrecision("total_value_rs").notNull(),
	txnStatus: varchar("txn_status").notNull(),
	txnType: varchar("txn_type").notNull(),
	txnSubtype: varchar("txn_subtype").notNull(),
	productName: varchar("product_name").notNull(),
	platform: varchar("platform").notNull(),
	version: varchar("version"),
	showInApp: boolean("show_in_app").notNull(),
	attachedCouponCode: varchar("attached_coupon_code"),
	discountRs: doublePrecision("discount_rs"),
	id: serial("id").primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP)`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP)`),
	ratePerGWoGst: doublePrecision("rate_per_g_wo_gst").notNull(),
	paymentMode: varchar("payment_mode"),
	externalTxnId: varchar("external_txn_id"),
	metaData: jsonb("meta_data"),
},
(table) => {
	return {
		ixTransactionsId: index("ix_transactions_id").on(table.id),
		ixTransactionsTxnStatus: index("ix_transactions_txn_status").on(table.txnStatus),
		ixTransactionsTxnSubtype: index("ix_transactions_txn_subtype").on(table.txnSubtype),
		ixTransactionsTxnType: index("ix_transactions_txn_type").on(table.txnType),
		ixTransactionsUuid: uniqueIndex("ix_transactions_uuid").on(table.uuid),
	}
});

export const mandateTransactions = pgTable("mandate_transactions", {
	mandateId: integer("mandate_id").notNull().references(() => mandates.id),
	status: varchar("status").notNull(),
	metaData: jsonb("meta_data"),
	id: serial("id").primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`timezone('Asia/Kolkata'::text, now())`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	executionRef: varchar("execution_ref"),
	txnNo: varchar("txn_no").notNull(),
	bankRrn: varchar("bank_rrn").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	notificationId: bigint("notification_id", { mode: "number" }).notNull().references(() => mandateNotifications.id),
},
(table) => {
	return {
		ixMandateTransactionsId: index("ix_mandate_transactions_id").on(table.id),
		mandateTransactionsTxnNoKey: unique("mandate_transactions_txn_no_key").on(table.txnNo),
	}
});

export const users = pgTable("users", {
	firstName: varchar("first_name").notNull(),
	middleName: varchar("middle_name"),
	lastName: varchar("last_name"),
	countryCode: varchar("country_code").notNull(),
	phoneNumber: varchar("phone_number").notNull(),
	displayName: varchar("display_name"),
	email: varchar("email"),
	jwtToken: varchar("jwt_token"),
	lastLogin: timestamp("last_login", { withTimezone: true, mode: 'string' }).default(sql`timezone('utc'::text, CURRENT_TIMESTAMP)`).notNull(),
	isActive: boolean("is_active"),
	lastPlatform: varchar("last_platform").notNull(),
	currentAppVersion: varchar("current_app_version").notNull(),
	id: serial("id").primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP)`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP)`),
	emailVerified: boolean("email_verified"),
	dob: varchar("dob"),
	partnerId: integer("partner_id").references(() => partners.id),
	kycVerified: boolean("kyc_verified"),
	pin: varchar("pin"),
	biometric: boolean("biometric"),
},
(table) => {
	return {
		ixUsersEmail: uniqueIndex("ix_users_email").on(table.email),
		ixUsersId: index("ix_users_id").on(table.id),
		ixUsersPhoneNumber: uniqueIndex("ix_users_phone_number").on(table.phoneNumber),
	}
});

export const partners = pgTable("partners", {
	username: varchar("username").notNull(),
	password: varchar("password").notNull(),
	apiKey: varchar("api_key").notNull(),
	isActive: boolean("is_active"),
	name: varchar("name").notNull(),
	email: varchar("email").notNull(),
	plan: varchar("plan"),
	id: serial("id").primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP)`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP)`),
},
(table) => {
	return {
		ixPartnersId: index("ix_partners_id").on(table.id),
		partnersUsernameKey: unique("partners_username_key").on(table.username),
	}
});

export const userKycDetails = pgTable("user_kyc_details", {
	kycVerifiedOn: timestamp("kyc_verified_on", { withTimezone: true, mode: 'string' }).default(sql`timezone('utc'::text, CURRENT_TIMESTAMP)`).notNull(),
	kycVerifiedBy: varchar("kyc_verified_by").notNull(),
	kycData: jsonb("kyc_data"),
	kycNumber: varchar("kyc_number").notNull(),
	userId: integer("user_id").notNull().references(() => users.id),
	kycRequestId: varchar("kyc_request_id"),
	id: serial("id").primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP)`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP)`),
},
(table) => {
	return {
		ixUserKycDetailsId: index("ix_user_kyc_details_id").on(table.id),
		ixUserKycDetailsKycNumber: index("ix_user_kyc_details_kyc_number").on(table.kycNumber),
	}
});

export const mandates = pgTable("mandates", {
	userId: integer("user_id").notNull().references(() => users.id),
	amount: doublePrecision("amount").notNull(),
	recurrence: varchar("recurrence"),
	recurDay: varchar("recur_day"),
	recurDate: integer("recur_date"),
	attachedVpaId: varchar("attached_vpa_id"),
	mandateRef: varchar("mandate_ref").notNull(),
	startDate: varchar("start_date").notNull(),
	endDate: varchar("end_date").notNull(),
	status: varchar("status").notNull(),
	pattern: varchar("pattern").notNull(),
	metaData: jsonb("meta_data"),
	id: serial("id").primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP)`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP)`),
	bankId: integer("bank_id").references(() => userBanks.id),
	txnNo: varchar("txn_no").notNull(),
	lastSuccessNotifyDate: timestamp("last_success_notify_date", { withTimezone: true, mode: 'string' }),
	lastSuccessExecutionDate: timestamp("last_success_execution_date", { withTimezone: true, mode: 'string' }),
},
(table) => {
	return {
		ixMandatesId: index("ix_mandates_id").on(table.id),
	}
});

export const webhookLogs = pgTable("webhook_logs", {
	vendor: varchar("vendor").notNull(),
	serverResponseCode: integer("server_response_code"),
	requestData: jsonb("request_data"),
	headers: varchar("headers"),
	error: varchar("error"),
	id: serial("id").primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`timezone('Asia/Kolkata'::text, now())`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
},
(table) => {
	return {
		ixWebhookLogsId: index("ix_webhook_logs_id").on(table.id),
	}
});

export const vendorApiLogs = pgTable("vendor_api_logs", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }),
	vendor: varchar("vendor").notNull(),
	encryptedRequestData: jsonb("encrypted_request_data"),
	requestData: jsonb("request_data"),
	headers: varchar("headers"),
	requestId: integer("request_id"),
	responseData: jsonb("response_data"),
	encryptedResponseData: jsonb("encrypted_response_data"),
	responseCode: integer("response_code"),
	url: varchar("url"),
	id: serial("id").primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`timezone('Asia/Kolkata'::text, now())`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
},
(table) => {
	return {
		ixVendorApiLogsId: index("ix_vendor_api_logs_id").on(table.id),
	}
});

export const userBanks = pgTable("user_banks", {
	userId: integer("user_id").notNull().references(() => users.id),
	bankName: varchar("bank_name").notNull(),
	accountNumber: varchar("account_number").notNull(),
	ifscCode: varchar("ifsc_code").notNull(),
	accountType: varchar("account_type").notNull(),
	accountHolderName: varchar("account_holder_name").notNull(),
	vpa: varchar("vpa").notNull(),
	id: serial("id").primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP)`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP)`),
},
(table) => {
	return {
		ixUserBanksId: index("ix_user_banks_id").on(table.id),
	}
});

export const mandateNotifications = pgTable("mandate_notifications", {
	mandateId: integer("mandate_id").notNull().references(() => mandates.id),
	status: varchar("status").notNull(),
	metaData: jsonb("meta_data"),
	id: serial("id").primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`timezone('Asia/Kolkata'::text, now())`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	seqNo: varchar("seq_no").notNull(),
	expectedExecutionDate: timestamp("expected_execution_date", { withTimezone: true, mode: 'string' }),
},
(table) => {
	return {
		ixMandateNotificationsId: index("ix_mandate_notifications_id").on(table.id),
		mandateNotificationsMandateIdSeqNoKey: unique("mandate_notifications_mandate_id_seq_no_key").on(table.mandateId, table.seqNo),
	}
});