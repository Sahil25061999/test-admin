import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import * as schema from "../drizzle/schema";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

export async function connect() {
  try {
    const client = new Client({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      // ssl:true
    });

    await client.connect();
    const db = drizzle(client, { schema });
    return {db,client};
  } catch (e) {
    console.log(e);
  }
}
