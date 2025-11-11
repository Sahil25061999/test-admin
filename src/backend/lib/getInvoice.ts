import { eq } from "drizzle-orm";
import { connect } from "../config/connect";
import { invoices, mandates, transactions, users } from "../drizzle/schema";

export const getInvoice = async (id) => {
  let db;
  let connection;
  try {
    const dbConnect = await connect();
    db = dbConnect.db;
    connection = dbConnect.client;
    const result = await db
      .select({
        downloadLink: invoices.downloadUrl,
      })
      .from(transactions)
      .leftJoin(invoices, eq(invoices.id, transactions.invoiceId))
      .where(eq(transactions.externalTxnId, id));

    return result;
  } catch (e) {
    throw e;
  } finally {
    connection?.end();
  }
};
