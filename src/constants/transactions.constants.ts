import { compareAsc, parse } from "date-fns";

export const BUY_TXN_COLUMNS = [
  {
    title: "Id",
    dataIndex: "Id",
    key: "Id",
  },
  {
    title: "Transaction Id",
    dataIndex: "Transaction Id",
    key: "Transaction Id",
    // filters:[{
    //   text:'john',
    //   value:'john'
    // }],
    // // filterSearch:true,
    // // filterMode:'tree',
    // // onFilter: (value, record) => record.name.startsWith(value),
  },
  {
    title: "Quantity",
    dataIndex: "Quantity",
    key: "Quantity",
  },
  {
    title: "Amount",
    dataIndex: "Amount",
    key: "Amount",
  },
  {
    title: "Date",
    dataIndex: "Date",
    key: "Date",
    sorter: (a, b) => {
      const dateString = a?.Date;
      const dateString2 = b?.Date;
      const parsedDate = parse(dateString, "dd/MM/yyyy, HH:mm:ss", new Date());
      const parsedDate2 = parse(
        dateString2,
        "dd/MM/yyyy, HH:mm:ss",
        new Date()
      );
      // const formattedDate = format(parsedDate, "dd MMMM yyyy, HH:mm:ss");
      return compareAsc(parsedDate, parsedDate2);
    },
  },
  {
    title: "User Details",
    dataIndex: "User Details",
    key: "User Details",
  },
  {
    title: "Status",
    dataIndex: "Status",
    key: "Status",
    width: "200px",
    filters: [
      {
        text: "Successful",
        value: "SUCCESSFUL",
      },
      {
        text: "Failed",
        value: "FAILED",
      },
      {
        text: "Refunded",
        value: "REFUNDED",
      },
      {
        text: "Pending",
        value: "PENDING",
      },
      {
        text: "Refund initiated",
        value: "REFUND-INITIATED",
      },
    ],
    onFilter: (value, record) => {
      console.log("VALUE==>", value);
      if (
        value.includes("SUCCESSFUL") ||
        value.includes("FAILED") ||
        value.includes("REFUNDED")
      ) {
        return record.Status === value;
      }

      return record.Status?.props?.children[0]?.props?.children === value;
    },
  },
  {
    title: "Rates",
    dataIndex: "Rates",
    key: "Rates",
  },

  
];


export const SELL_TXN_COLUMNS = [
  {
    title: "Id",
    dataIndex: "Id",
    key: "Id",
  },
  {
    title: "Transaction Id",
    dataIndex: "Transaction Id",
    key: "Transaction Id",
  },
  {
    title: "Quantity",
    dataIndex: "Quantity",
    key: "Quantity",
  },
  {
    title: "Amount",
    dataIndex: "Amount",
    key: "Amount",
  },
  {
    title: "Date",
    dataIndex: "Date",
    key: "Date",
    sorter: (a, b) => {
      const dateString = a?.Date;
      const dateString2 = b?.Date;
      const parsedDate = parse(dateString, "dd/MM/yyyy, HH:mm:ss", new Date());
      const parsedDate2 = parse(
        dateString2,
        "dd/MM/yyyy, HH:mm:ss",
        new Date()
      );
      // const formattedDate = format(parsedDate, "dd MMMM yyyy, HH:mm:ss");
      return compareAsc(parsedDate, parsedDate2);
      // parsedDate.toISOString().localeCompare(parsedDate2.toISOString());
    },
  },
  {
    title: "User Details",
    dataIndex: "User Details",
    key: "User Details",
  },
  {
    title: "Status",
    dataIndex: "Status",
    key: "Status",
    // width: "200px",
    filters: [
      {
        text: "Successful",
        value: "SUCCESSFUL",
      },
      {
        text: "Failed",
        value: "FAILED",
      },
      {
        text: "Completed",
        value: "COMPLETED",
      },
    ],
    onFilter: (value, record) => {
      // console.log("VALUE==>", value);
      if (value.includes("COMPLETED") || value.includes("FAILED")) {
        return record.Status === value;
      }

      return record.Status?.props?.children[0]?.props?.children === value;
    },
  },
  {
    title: "Notes",
    dataIndex: "Notes",
    key: "Notes",
    // width: "180px",
  },
    {
      title: "Rates",
      dataIndex: "Rates",
      key: "Rates",
    },
  
];
