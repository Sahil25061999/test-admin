import { count, eq } from "drizzle-orm";
import { connect } from "../config/connect";
import { users } from "../drizzle/schema";
import {logger} from '../../../logger';

export const getUserCount = async () => {
  let db;
  let connection;
  try {
    const dbConnect = await connect();
    db = dbConnect.db;
    connection = dbConnect.client;
    logger.info(`CONNCection, ${dbConnect.client}`)
    const result = await db.select({ value: count() }).from(users);

    return result
  } catch (e) {
    console.log("ERROR DB", e)
    throw e;
  } finally {
    connection?.end();
  }
};
