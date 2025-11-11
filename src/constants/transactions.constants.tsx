import { List, Table, Typography } from "antd";
import { sub, compareAsc, format, parse } from "date-fns";
import Link from "next/link";

export const BUY_TXN_COLUMNS = [
  // {
  //   title: "Kyc",
  //   dataIndex: "Kyc",
  //   key: "Kyc",
  // },
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
    },
  },
  // {
  //   title: "User Details",
  //   dataIndex: "User Details",
  //   key: "User Details",
  // },
  {
    title: "User Details",
    dataIndex: "user",
    key: "User Details",
    render:(item)=>{
      return (
        <List
          // header={<div>Header</div>}
          // footer={<div>Footer</div>}
          bordered
          size="small"
          style={{
            // minWidth: 100,
          }}
          dataSource={[item]}
          renderItem={(item) => (
            <>
              <List.Item>
                <Typography.Text className=" whitespace-nowrap">Name</Typography.Text>
                <Typography.Text className=" whitespace-nowrap">{item.first_name +" "+ item.last_name}</Typography.Text>
              </List.Item>
              <List.Item>
                <Typography.Text className=" whitespace-nowrap">Phone</Typography.Text><Typography.Text className=" whitespace-nowrap">
                {item.phone_number}</Typography.Text>
              </List.Item>
              <List.Item>
                <Typography.Text className=" whitespace-nowrap">Kyc Verified</Typography.Text><Typography.Text className=" whitespace-nowrap">
                {`${item.kyc_verified}`}</Typography.Text>
              </List.Item>
              
            </>
          )}
        />
        
      );
    }
  },
  {
    title: "UPI/Bank",
    dataIndex: "meta_data",
    key: "UPI",
    render:(item)=>{
      // console.log(item)
      if(!item) return
      let data = Object.entries(item).map(([key, value]) => ({
        key,
        value
      }));
      return (
        <List
          // header={<div>Header</div>}
          // footer={<div>Footer</div>}
          bordered
          size="small"
          style={{
            // minWidth: 100,
          }}
          dataSource={data}
          renderItem={(item) => (
            item.key === "created_at" || item.key === "updated_at" || item.key === "req_id" || item.key === "id" || item.key === "user_id"  ? null :
            <List.Item>
              <Typography.Text className=" whitespace-nowrap">{item.key}</Typography.Text>
              <Typography.Text className=" whitespace-nowrap">{item.value as string}</Typography.Text>
            </List.Item>
          )}
        />
      ); 
    }
    
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
  // {
  //   title: "Invoice",
  //   dataIndex: "Invoice",
  //   key: "Invoice",
  // },
];

export const SELL_TXN_COLUMNS = [
  // {
  //   title: "Kyc",
  //   dataIndex: "Kyc",
  //   key: "Kyc",
  // },
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
    title: "Payout Amount",
    dataIndex: "Amount",
    key: "Payout Amount",
  },
  {
    title: "Date",
    dataIndex: "Date",
    key: "Date",
    render:(item)=>{
      try{
        const date = format(sub(parse(item, "dd/MM/yyyy, HH:mm:ss", new Date()), {hours:5 , minutes:30}) , 'dd/MM/yyyy hh:mm a')
        return date
      }catch(e){
        return item
      }
       
    },
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
    title:"Beneficiary's UPI ID",
    dataIndex:"meta_data",
    key:"Upi",
    render:(item)=>{
      return  <Typography.Text className=" whitespace-nowrap ml-2">{item?.vpa}</Typography.Text> 
    }
  },
  {
    title:"Beneficiary Name",
    dataIndex:"user",
    key:"Beneficiary Name",
    render:(item)=>{
      return  <Typography.Text className="  max-w-xs truncate">{item.first_name !== item.last_name ? item.first_name +" "+ (item.last_name || ""): item.first_name}</Typography.Text> 
    }
  },
  {
    title:"State",
    dataIndex:"user",
    key:"State",
    render:(item)=>{
      return  <Typography.Text className="  max-w-xs truncate">{item.state}</Typography.Text> 
    }
  },
  {
    title:"Phone Number",
    dataIndex:"user",
    key:"Phone Number",
    render:(item)=>{
      return  <Typography.Text className="  max-w-xs truncate">{item.phone_number}</Typography.Text> 
    }
  },
  {
    title:"Email ID",
    dataIndex:"user",
    key:"Email ID",
    render:(item)=>{
      return  <Typography.Text className="  max-w-xs truncate">{item.email}</Typography.Text> 
    }
  },
  {
    title:"Contact Reference ID",
    dataIndex:"user",
    key:"Contact Reference ID",
    render:(item)=>{
      return  <Typography.Text className="  max-w-xs truncate">{item.id}</Typography.Text> 
    }
  },
 
  // {
  //   title: "User Details",
  //   dataIndex: "user",
  //   key: "User Details",
  //   width:200,
  //   render:(item)=>{
  //     return (
  //       <List
  //         // header={<div>Header</div>}
  //         // footer={<div>Footer</div>}
  //         bordered
  //         size="small"
  //         className=" max-w-sm"
  //         dataSource={[item]}
  //         renderItem={(item) => (
  //           <>
  //             <List.Item>
  //               <Typography.Text className=" whitespace-nowrap ">Name</Typography.Text>

  //               <Typography.Text className=" overflow-hidden truncate max-w-[50%] ml-2">{item.first_name +" "+ item.last_name}</Typography.Text>
  //             </List.Item>
  //             <List.Item>
  //               <Typography.Text className=" whitespace-nowrap">Phone</Typography.Text><Typography.Text className=" whitespace-nowrap">
  //               {item.phone_number}</Typography.Text>
  //             </List.Item>
              
  //           </>
  //         )}
  //       />
        
  //     );
  //   }
  // },
  {
    title: "UPI/Bank",
    dataIndex: "meta_data",
    key: "UPI",
    render:(item)=>{
      if(!item) return
      let data = Object.entries(item).map(([key, value]) => ({
        key,
        value
      }));
      return (
        <List
          // header={<div>Header</div>}
          // footer={<div>Footer</div>}
          bordered
          size="small"
          style={{
            // minWidth: 100,
          }}
          dataSource={data}
          renderItem={(item) => (
            item.key === "created_at" || item.key === "updated_at" || item.key === "req_id" || item.key === "id" || item.key === "user_id"  ? null :
            <List.Item>
              <Typography.Text className=" whitespace-nowrap">{item.key}</Typography.Text>
              <Typography.Text className=" whitespace-nowrap ml-2">{item.value as string}</Typography.Text>
            </List.Item>
          )}
        />
      ); 
    }
    
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
  // {
  //   title: "Notes",
  //   dataIndex: "Notes",
  //   key: "Notes",
  //   // width: "180px",
  // },
  {
    title: "Rates",
    dataIndex: "Rates",
    key: "Rates",
  },
  // {
  //   title: "Invoice",
  //   dataIndex: "Invoice",
  //   key: "Invoice",
  // },
];

export const GOLD_REDEMPTION_TXN_COLUMNS:any = [
  {
    title: "Transaction Id",
    dataIndex: "transaction",
    key: "transactionId",
    fixed: "left",
    render: (item) => {
      // console.log(item)
      return item["txn_id"];
    },
  },
  {
    title: "Gold Quantity Purchased",
    dataIndex: "transaction",
    fixed: "left",
    key: "transactionGoldQuantityPurchased",
    render: (item) => {
      return item["quantity_purchased"];
    },
  },
  {
    title: "Gold Redeemed From Vault",
    dataIndex: "transaction",
    key: "transactionGoldRedeemedFromVault",
    render: (item) => item["redeemed_from_vault"],
  },
  // {
  //   title: "Base price",
  //   dataIndex: "transaction",
  //   key: "transactionRates",
  //   render: (item) => item["base_price"],
  // },
  {
    title: "Making/Delivery Price",
    dataIndex: "transaction",
    key: "transactionMakingPrice",
    render: (item) => item["making_price"],
  },
  {
    title: "Total Price",
    dataIndex: "transaction",
    key: "transactionGoldRedeemedFromVault",
    render: (item) => item["total_price"],
  },
  {
    title: "Gold meta data",
    dataIndex: "transaction",
    key: "transactionGoldMetaData",
    render: (item) => {
      // console.log("ITEMS ",item)
      let data = Object.entries(item.metadata).map(([key, value]) => ({
        Grams: key,
        quantity: value,
      }));
      return (
        <>
        <List
          // header={<div>Header</div>}
          // footer={<div>Footer</div>}
          bordered
          size="large"
          style={{
            minWidth: 100,
          }}
          dataSource={[{productLabel:item.product_name}]}
          renderItem={(item) => (
            <List.Item>
              <Typography.Text className=" whitespace-nowrap">Product</Typography.Text>
              <Typography.Text className=" whitespace-nowrap ml-2">{item.productLabel}</Typography.Text>
              
            </List.Item>
          )}
        />
        <List
          // header={<div>Header</div>}
          // footer={<div>Footer</div>}
          bordered
          size="large"
          style={{
            minWidth: 100,
          }}
          dataSource={data}
          renderItem={(item) => (
            <List.Item>
              <Typography.Text className=" whitespace-nowrap">{item.Grams}gm</Typography.Text>
              {item.quantity as string}
            </List.Item>
          )}
        />
        </>
      );
     
    },
  },
  {
    title: "Date",
    dataIndex: "transaction",
    key: "Date",
    render:(item)=>{
      return format( sub( new Date(item.created_at), {hours:5 , minutes:30}) , 'dd/MM/yyyy hh:mm a') 
    },
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
    dataIndex: "address",
    key: "addressUser",
    render: (item) => {
      // console.log(item);

      return (
        <List
          // header={<div>Header</div>}
          // footer={<div>Footer</div>}
          bordered
          size="small"
          style={{
            // minWidth: 100,
          }}
          dataSource={[item]}
          renderItem={(item) => (
            <>
              <List.Item>
                <Typography.Text className=" whitespace-nowrap">Name</Typography.Text>
                <Typography.Text className=" whitespace-nowrap">{item.name}</Typography.Text>
              </List.Item>
              <List.Item>
                <Typography.Text className=" whitespace-nowrap">Phone</Typography.Text><Typography.Text className=" whitespace-nowrap">
                {item.phone_number}</Typography.Text>
              </List.Item>
              <List.Item>
                <Typography.Text className=" whitespace-nowrap">Pincode</Typography.Text><Typography.Text className=" whitespace-nowrap">
                {item.pincode}</Typography.Text>
              </List.Item>
              <List.Item>
                <Typography.Text className=" whitespace-nowrap">State</Typography.Text><Typography.Text className=" whitespace-nowrap">
                {item.state}</Typography.Text>
              </List.Item>
              <List.Item>
                <Typography.Text className=" whitespace-nowrap">City</Typography.Text><Typography.Text className=" whitespace-nowrap">
                {item.city}</Typography.Text>
              </List.Item>
              <List.Item className=" gap-x-3">
                <Typography.Text style={{minWidth:"fit-content"}}>Address</Typography.Text><Typography.Text className=" text-right">
                {item.street_address +" "+ item.street_address2}</Typography.Text>
              </List.Item>
            </>
          )}
        />
        // <Table
        //   columns={[
        //     {
        //       title: "Name",
        //       dataIndex: "name",
        //       key: "name",
        //     },
        //     {
        //       title: "Phone",
        //       dataIndex: "phone_number",
        //       key: "phone",
        //     },
        //     {
        //       title: "Pincode",
        //       dataIndex: "pincode",
        //       key: "pincode",
        //     },
        //     {
        //       title: "State",
        //       dataIndex: "state",
        //       key: "state",
        //     },
        //     {
        //       title: "City",
        //       dataIndex: "city",
        //       key: "city",
        //     },
        //     {
        //       title: "Address line 1",
        //       dataIndex: "street_address",
        //       key: "street_address",
        //     },
        //     {
        //       title: "Address line 2",
        //       dataIndex: "street_address2",
        //       key: "street_address2",
        //     },
        //   ]}
        //   dataSource={[item]}
        //   pagination={false}
        // />
      );
    },
  },

  {
    title: "Status",
    dataIndex: "transaction",
    key: "transactionStatus",
    render: (item) => item["txn_status"],
    // width: "200px",
    // filters: [
    //   {
    //     text: "Successful",
    //     value: "SUCCESSFUL",
    //   },
    //   {
    //     text: "Failed",
    //     value: "FAILED",
    //   },
    //   {
    //     text: "Completed",
    //     value: "COMPLETED",
    //   },
    // ],
    // onFilter: (value, record) => {
    //   // console.log("VALUE==>", value);
    //   if (value.includes("COMPLETED") || value.includes("FAILED")) {
    //     return record.Status === value;
    //   }

    //   return record.Status?.props?.children[0]?.props?.children === value;
    // },
  },
 
  // {
  //   title: "Invoice",
  //   dataIndex: "Invoice",
  //   key: "Invoice",
  // },
];


export const MANDATE_INFO = [
  {
    title: "Amount",
    dataIndex: "amount",
    key: "Amount",
  },
  {
    title: "Recurrence",
    dataIndex: "recurrence",
    key: "Recurrence",
  },
  {
    title: "Mandate Id",
    dataIndex: "mandate_id",
    key: "Mandate Id",
    
  },
  {
    title: "Mandate Status",
    dataIndex: "mandate_status",
    key: "Mandate Status",
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "Amount",
  },
  {
    title:"Notification Id",
    dataIndex:"notification_id",
    key:"Notification Id",
    render:(item)=> <Link href={`/mandate/${item}`}>{item}</Link>
  },
  {
    title:"Start Date",
    dataIndex:"start_date",
    key:"Start Date"
  },
  {
    title:"Notification Status",
    dataIndex:"notification_status",
    key:"Notification Status"
  },
  {
    title:"Mandate Meta Data",
    dataIndex:"mandate_meta_data",
    key:"Mandate Meta Data",
    render:(item)=>{
      const callback_data = item.mandate_callback ? Object.entries(item.mandate_callback) : null
      return (
        <>
        <List
          header={<h3 className=" font-semibold">Callback Data</h3>}
          // footer={<div>Footer</div>}
          bordered
          size="small"
          style={{
            // minWidth: 100,
          }}
          dataSource={callback_data}
          renderItem={([label,value]:any) => (
            <>
              <List.Item>
                <Typography.Text className=" whitespace-nowrap">{label}</Typography.Text>
                <Typography.Text className=" whitespace-nowrap">{value}</Typography.Text>
              </List.Item>
          
              
            </>
          )}
        />
        </>
        
      );
    }
    
  },
  {
    title:"Notification Meta Data",
    dataIndex:"notification_meta_data",
    key:"Notification Meta Data",
    render:(item)=>{
      const callback_data = item ? Object.entries(item) : null
      return (
        <>
        <List
          // header={<h3 className=" font-semibold">Callback Data</h3>}
          // footer={<div>Footer</div>}
          bordered
          size="small"
          style={{
            // minWidth: 100,
          }}
          dataSource={callback_data}
          renderItem={([label,value]:any) => (
            <>
              <List.Item>
                <Typography.Text className=" whitespace-nowrap">{label}</Typography.Text>
                <Typography.Text className=" whitespace-nowrap">{value}</Typography.Text>
              </List.Item>
          
              
            </>
          )}
        />
        </>
        
      );
    }
    
  }
  
]

export const MANDATE_TXN_INFO = [
  {
    title: "Transaction Id",
    dataIndex: "transaction_id",
    key: "Transaction Id",
  },
  {
    title: "Mandate Id",
    dataIndex: "mandate_id",
    key: "Mandate Id",
  },
  {
    title: "Transaction Number",
    dataIndex: "transaction_number",
    key: "Transaction Number",
  },
  {
    title:"Transaction Meta Data",
    dataIndex:"transaction_meta_data",
    key:"Transaction Meta Data",
    render:(item)=>{
      const callback_data = item ? Object.entries(item) : null
      return (
        <>
        <List
          header={<h3 className=" font-semibold">Callback Data</h3>}
          // footer={<div>Footer</div>}
          bordered
          size="small"
          style={{
            // minWidth: 100,
          }}
          dataSource={callback_data}
          renderItem={([label,value]:any) => (
            <>
              <List.Item>
                <Typography.Text className=" whitespace-nowrap">{label}</Typography.Text>
                <Typography.Text className=" whitespace-nowrap">{value}</Typography.Text>
              </List.Item>
          
              
            </>
          )}
        />
        </>
        
      );
    }
    
  },
]