import { eq, sql, desc, and, inArray } from "drizzle-orm";
import { connect } from "../config/connect";
import { mandates, users } from "../drizzle/schema";

const handleStatusFilter = (status) => {
  return inArray(
    mandates.status,
    status.split(",").length > 0 ? status.split(",") : [status]
  );
};

const handleDateFilter = (startdate, enddate) => {
  return sql`Date(${mandates.createdAt}) >= ${new Date(startdate)} and Date(${
    mandates.createdAt
  }) <= ${new Date(enddate)}`;
};
interface MandateParams {
  limit?: number;
  page?: number;
  phone?: string;
  txnid?: number;
  status?: string;
  startdate?: string;
  enddate?: string;
}

export const getMandates = async ({
  limit,
  page,
  phone,
  txnid,
  status,
  startdate,
  enddate,
}: MandateParams) => {
  let db;
  let connection;
  try {
    const dbConnect = await connect();
    db = dbConnect.db;
    connection = dbConnect.client;
    let fields = {
      id: mandates.id,
      vpa: mandates.attachedVpaId,
      status: mandates.status,
      amount: mandates.amount,
      mandateRef: mandates.mandateRef,
      createdAt: mandates.createdAt,
      metaData: mandates.metaData,
      name: users.firstName,
      phone: users.phoneNumber,
    };
    let baseQuery = db
      .select(fields)
      .from(mandates)
      .leftJoin(users, eq(users.id, mandates.userId))
      .orderBy(desc(mandates.createdAt))
      .$dynamic();

    if (!startdate) {
      startdate = enddate;
    } else if (!enddate) {
      enddate = startdate;
    } else {
      if (startdate > enddate) {
        throw new Error("start date cannot be greater than end date");
      }
    }

    if (phone) {
      if (status && startdate) {
        baseQuery = baseQuery.where(
          and(
            eq(users.phoneNumber, phone),
            handleDateFilter(startdate, enddate),
            handleStatusFilter(status)
          )
        );
      } else if (status) {
        baseQuery = baseQuery.where(
          and(eq(users.phoneNumber, phone), handleStatusFilter(status))
        );
      } else if (startdate) {
        baseQuery = baseQuery.where(
          and(
            eq(users.phoneNumber, phone),
            handleDateFilter(startdate, enddate)
          )
        );
      } else {
        baseQuery = baseQuery.where(eq(users.phoneNumber, phone));
      }
    } else if (txnid) {
      if (status && startdate) {
        baseQuery = baseQuery.where(
          and(
            eq(mandates.id, txnid),
            handleDateFilter(startdate, enddate),
            handleStatusFilter(status)
          )
        );
      } else if (status) {
        baseQuery = baseQuery.where(
          and(eq(mandates.id, txnid), handleStatusFilter(status))
        );
      } else if (startdate) {
        baseQuery = baseQuery.where(
          and(eq(mandates.id, txnid), handleDateFilter(startdate, enddate))
        );
      } else {
        baseQuery = baseQuery.where(and(eq(mandates.id, txnid)));
      }
    } else if (status && startdate) {
      baseQuery = baseQuery.where(
        and(handleDateFilter(startdate, enddate), handleStatusFilter(status))
      );
    } else if (status) {
      baseQuery = baseQuery.where(handleStatusFilter(status));
    } else if (startdate) {
      baseQuery = baseQuery.where(handleDateFilter(startdate, enddate));
    }

    const totalPages = Math.ceil((await baseQuery)?.length / limit);
    const result = await baseQuery.limit(limit * 1).offset((page - 1) * limit);

    if (result) {
      return { result, totalPages };
    }
    throw new Error("something went wrong");
  } catch (e) {
    console.log(e);
    throw e;
  } finally {
    connection?.end();
  }
};

// export const getMandates = async ({
//   limit,
//   page,
//   phone,
//   txnid,
//   status,
//   startdate,
//   enddate,
// }) => {
//   try {
//     const { db, client: connection } = await connect();
//     console.log(phone, status);
//     let fields = {
//       id: mandates.id,
//       vpa: mandates.attachedVpaId,
//       status: mandates.status,
//       amount: mandates.amount,
//       mandateRef: mandates.mandateRef,
//       createdAt: mandates.createdAt,
//       name: users.firstName,
//       phone: users.phoneNumber,
//     };

//     let baseQuery = db
//       .select(fields)
//       .from(mandates)
//       .where(
//         phone
//           ? eq(users.phoneNumber, phone)
//           : txnid
//           ? eq(mandates.id, txnid)
//           : null
//       )
//       .leftJoin(users, eq(users.id, mandates.userId));
//     let baseQuery2 = db
//       .select({
//         totalPages: count(),
//       })
//       .from(mandates)
//       .where(
//         phone
//           ? eq(users.phoneNumber, phone)
//           : txnid
//           ? eq(mandates.id, txnid)
//           : null
//       )
//       .leftJoin(users, eq(users.id, mandates.userId));

//     if (status) {
//       baseQuery = baseQuery.where(
//         inArray(
//           mandates.status,
//           status.split(",").length > 0 ? status.split(",") : [status]
//         )
//       );
//       baseQuery2 = baseQuery2.where(
//         inArray(
//           mandates.status,
//           status.split(",").length > 0 ? status.split(",") : [status]
//         )
//       );
//     }

//     if (!startdate) {
//       startdate = enddate;
//     } else if (!enddate) {
//       enddate = startdate;
//     } else {
//       if (startdate > enddate) {
//         throw new Error("start date cannot be greater than end date");
//       }
//       baseQuery = baseQuery.where(
//         sql`Date(${mandates.createdAt}) >= ${new Date(startdate)} and Date(${
//           mandates.createdAt
//         }) <= ${new Date(enddate)}`
//       );
//       baseQuery2 = baseQuery2.where(
//         sql`Date(${mandates.createdAt}) >= ${new Date(startdate)} and Date(${
//           mandates.createdAt
//         }) <= ${new Date(enddate)}`
//       );
//     }

//     let totalPages: unknown = await baseQuery2;
//     console.log(totalPages);

//     const result = await baseQuery
//       .limit(limit * 1)
//       .offset((page - 1) * limit)
//       .orderBy(desc(mandates.createdAt));

//     totalPages = Math.ceil(totalPages[0].totalPages / limit);

//     connection.end();
//     if (result) {
//       return { result, totalPages };
//     }
//     throw new Error("something went wrong");
//   } catch (e) {
//     console.log(e);
//     throw e;
//   } finally {
//   }
// };

// export const getMandates = async ({
//   limit,
//   page,
//   phone,
//   txnid,
//   status,
//   startdate,
//   enddate,
// }) => {
//   try {
//     const { db, client: connection } = await connect();
//     let fields = {
//       id: mandates.id,
//       vpa: mandates.attachedVpaId,
//       status: mandates.status,
//       amount: mandates.amount,
//       mandateRef: mandates.mandateRef,
//       createdAt: mandates.createdAt,
//       name: users.firstName,
//       phone: users.phoneNumber,
//     };
//     let queryString = `Date(${mandates.createdAt}) >= ${new Date(
//       startdate
//     )} and Date(${mandates.createdAt}) <= ${new Date(enddate)}`;
//     let query: SQL<unknown> | null = sql`${queryString}`;
//     if (startdate && !enddate) {
//       enddate = startdate;
//     } else if (!startdate && enddate) {
//       startdate = enddate;
//     } else if (!startdate && !enddate) {
//       query = null;
//     }
//     if (status) {
//       if (query) {
//         queryString = queryString + ` AND ${mandates.status} IN (${status})`;
//       } else {
//         query = sql`${mandates.status} IN ${sql.placeholder("statusValue")}`;
//       }
//     }
//     // console.log(queryString, query)
//     // if (phone) {
//     //   if (query) {
//     //     queryString = queryString + ` AND ${users.phoneNumber} = ${phone}`;
//     //   } else {
//     //     query = sql`${users.phoneNumber} = ${phone}`;
//     //   }
//     // }
//     let result = await db
//       .select(fields)
//       .from(mandates)
//       .leftJoin(users, eq(users.id, mandates.userId))
//       .where(query)
//       .limit(limit * 1)
//       .offset((page - 1) * limit)
//       .orderBy(desc(mandates.createdAt));
//     console.log(status, result);

//     let totalRows = await await db
//       .select({ totalPages: count() })
//       .from(mandates)
//       .leftJoin(users, eq(users.id, mandates.userId))
//       .where(query);0

//     connection.end();
//     let totalPages =
//       totalRows.length > 0 ? Math.ceil(totalRows[0].totalPages / limit) : 0;

//     return { result, totalPages };
//   } catch (e) {
//     console.log(e);
//     throw e;
//   } finally {
//   }
// };
