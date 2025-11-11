import { compareAsc, parse } from "date-fns";

export const mandatesColumns = [
  {
    title: "Sr.No.",
    dataIndex: "Sr.No.",
    key: "Sr.No.",
  },
  {
    title: "Mandate Id",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Mandate Ref",
    dataIndex: "mandateRef",
    key: "mandateRef",
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Phone",
    dataIndex: "phone",
    key: "phone",
  },
  {
    title: "Date",
    dataIndex: "createdAt",
    key: "createdAt",
    sorter: (a, b) => {
      console.log(a);
      console.log(b);
      const dateString = a?.createdAt;
      const dateString2 = b?.createdAt;
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
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: "200px",
    filters: [
      {
        text: "Active",
        value: "ACTIVE",
      },
      {
        text: "Pending",
        value: "PENDING",
      },
      {
        text: "Revoked",
        value: "REVOKED",
      },
      {
        text: "Failed",
        value: "FAILED",
      },
    ],
    onFilter: (value, record) => {
      // console.log("VALUE==>", value);
      if (
        value.includes("PENDING") ||
        value.includes("REVOKED") ||
        value.includes("FAILED")
      ) {
        return record.status === value;
      }

      return record.status?.props?.children[0]?.props?.children === value;
    },
  },
];
