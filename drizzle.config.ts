import type { Config } from "drizzle-kit";
export default {
  schema: "./src/backend/schema/*",
  out: "./src/backend/drizzle",
  driver: 'pg',
  dbCredentials: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
  }
} satisfies Config;