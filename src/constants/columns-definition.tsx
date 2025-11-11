import { compareAsc, parse } from "date-fns";
import { EyeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";


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
      // console.log(a);
      // console.log(b);
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

export const USER_COLUMNS = [
  {
    title: "KYC (pan number)",
    dataIndex: "kyc_details",
    key: "kyc_details",
    render: (item) => {
      // console.log(item)
      return item && item[0]?.kyc_number ? item[0]?.kyc_number : "Not verified";
    },
  },
  {
    title: "Name",
    dataIndex: "",
    key: "name",
    
    render: item => `${item.first_name} ${item.last_name || ""}`,
  },
  {
    title: "Phone",
    dataIndex: "phone_number",
    key: "phone",
    // render: item => Object.values(item)[3],
  },
  {
    title:'Actions',
    dataIndex:"",
    key:'Actions',
    render: item=>{
      return <Link href={`/users/${item.phone_number}`}><EyeIcon className="h-6 aspect-square"/></Link>
    }

  }
  // {
  //   title: "Address",
  //   dataIndex: "user",
  //   key: "user_address",
  //   // render: item => Object.values(item)[13],
  // },
  // {
  //   title: "Wallet balance(gms)",
  //   dataIndex: "wallet",
  //   key: "wallet_gold_balance",
  //   render: (item) => {
  //     return item  ? item?.gold_balance : null;
  //   },
  // },
  // {
  //   title: "Mandate",
  //   dataIndex: "mandate",
  //   render: (item) => {
  //     return item && item.length > 0 ? (
  //       <>
  //         <p>status: <b className=" text-green-400">{item[0]?.status}</b></p>
  //         <p>Amount: <b>{item[0]?.amount}</b></p>
  //       </>
  //     ) : (
  //       "Not Active"
  //     );
  //   },
  // },
  // {
  //   title: "Account Status",
  //   dataIndex: "account_status",
  //   key: "account_status",
  //   // render:item=>Object.values(item)[12]
  // },
  // {
  //   title: "Date",
  //   dataIndex: "date",
  //   key: "date",
  //   render: (item) => new Date(item).toLocaleString(),
  //   sorter: (a, b) => {
  //     console.log(a, b);
  //     const dateString = a?.date;
  //     const dateString2 = b?.date;
  //     const parsedDate = parse(dateString, "dd/MM/yyyy, HH:mm:ss", new Date());
  //     const parsedDate2 = parse(
  //       dateString2,
  //       "dd/MM/yyyy, HH:mm:ss",
  //       new Date()
  //     );
  //     // const formattedDate = format(parsedDate, "dd MMMM yyyy, HH:mm:ss");
  //     return compareAsc(parsedDate, parsedDate2);
  //     // parsedDate.toISOString().localeCompare(parsedDate2.toISOString());
  //   },
  // },
];
