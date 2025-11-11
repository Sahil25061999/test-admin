import { count, eq } from "drizzle-orm";
import { connect } from "../config/connect";
import { mandates, users } from "../drizzle/schema";

export const updateMandateStatus = async (id, status) => {
  let db;
  let connection;
  try {
    const dbConnect = await connect();
    db = dbConnect.db;
    connection = dbConnect.client;
    const result = await db
      .update(mandates)
      .set({ status: status })
      .where(eq(mandates.id, id))
      .returning({
        mandates,
      });
   

    return result;
  } catch (e) {
    throw e;
  } finally {
    connection?.end();
  }
};
