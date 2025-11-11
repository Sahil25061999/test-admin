"use client";
import { useCallback, useEffect, useState } from "react";
import { Typography } from "antd";
import { useToast } from "../context/toast.context";
import { useAuth } from "../context/auth";

const fetchUpi = async (phone: string) => {
  try {
    const res = await fetch(`/api/upis?phone=${phone}`);
    const data = await res.json();
    if (data?.success) {
      return data.data.join(",");
    }

    return [];
  } catch (e) {
    return [];
  }
};

export const useFetchList = ({ url, columns }) => {
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<
    | undefined
    | {
        txnid: string;
        statusToSet: string;
        transaction?: any;
        external_txn_id?: any;
      }
  >();
  const [date, setDate] = useState({
    startDate: "",
    endDate: "",
  });
  const [status, setStatus] = useState([]);
  const [search, setSearch] = useState({
    name: "",
    phone: "",
    txnid: "",
    txn_type: "",
    product_name: "",
  });
  const { toast } = useToast();
  const {token} = useAuth()
  
  const handleSelect = (value, transaction) => {
    setIsOpen(() => true);
    setCurrentTransaction(() => ({ ...transaction, statusToSet: value }));
  };
  

  const fetchList = useCallback(async () => {
   
    try {
      let query = new URLSearchParams({
        txn_type: "BUY",
        offset: ((currentPage - 1) * limit).toString(),
        limit: limit.toString(),
        startdate: date.startDate,
        enddate: date.endDate,
        // product_name: search.product_name,
      }) as unknown;
      query = query.toString();
      // console.log(search.product_name,query)
      const res = await fetch(`/api/transactions?url=${encodeURIComponent(url)}&${query}`);
      const data = await res.json();
      if (data?.success) {
        if (data.data.total_pages) {
          setTotalPages(() => data.data.total_pages);
        }

        if (url.includes("redemption")) {
          // console.log(data.data.transactions);
          setData(() =>
            data.data.transactions.map((item,index) => {
              console.log( item?.address?.name, item?.transaction?.txn_status);
              let transaction_status = item["transaction"]["txn_status"];
              item["transaction"]["txn_status"] =
                ['PROCESSING','AWAITING PICKUP','SHIPPED','IN-TRANSIT','OUT FOR DELIVERY','ORDER SUCCESSFUL'].includes(transaction_status) ? (
                  <select
                    className=" bg-transparent"
                    value={transaction_status}
                    onChange={(e) => handleSelect(e.target.value, item)}
                  >
                    <option className="bg-transparent text-black" value={transaction_status} selected disabled hidden>
                      {transaction_status}
                    </option>
                    <option className=" bg-white" value="SUCCESS">
                      SUCCESS
                    </option>
                    <option className=" bg-white" value="ORDER SUCCESSFUL">
                      Order Successful
                    </option>
                    <option className=" bg-white" value="AWAITING PICKUP">
                      Awaiting Pickup
                    </option>
                    <option className=" bg-white" value="SHIPPED">
                      Shipped
                    </option>
                    <option className=" bg-white" value="IN-TRANSIT">
                      In-Transit
                    </option>
                    <option className=" bg-white" value="OUT FOR DELIVERY">
                      Out for Delivery
                    </option>
                    <option className=" bg-white" value="DELIVERED">
                      Delivered
                    </option>
                    <option className=" bg-white" value="FLAGGED">
                      FLAGGED
                    </option>

                    {/* {item.transaction.redeemed_from_vault === 0 ?null:
                    <option className=" bg-white" value="CANCELLED">
                      CANCELLED
                    </option>
                    } */}
                  </select>
                ) : (
                  transaction_status
                );
              return {...item,key:item.transaction.txn_id};
            })
          );
        } else {
          setData(() => {
            return data.data.transactions.map((item) => {
              console.log(item);
              const row = {
                key: item?.external_txn_id,
                "Transaction Id": item?.external_txn_id,
                Quantity: item?.qty_g,
                Amount: item?.total_value_rs,
                Date: new Date(item.created_at).toLocaleString(),
                user: item?.user,
                meta_data: item?.meta_data,
              };
              row["Status"] =
                item.txn_status === "PROCESSING" ? (
                  <select
                    className=" bg-transparent"
                    value={item.txn_status}
                    onChange={(e) => handleSelect(e.target.value, item)}
                  >
                    <option className="bg-transparent text-black" value={item.txn_status} selected disabled hidden>
                      {item.txn_status}
                    </option>
                    <option className=" bg-white" value="SUCCESS">
                      SUCCESS
                    </option>
                    <option className=" bg-white" value="FLAGGED">
                      FLAGGED
                    </option>
                    {/* <option className=" bg-white" value="CANCELLED">
                      CANCELLED
                    </option> */}
                  </select>
                ) : (
                  item.txn_status
                );
              row["Notes"] = <Typography.Text>{item.notes}</Typography.Text>;
              row["Rates"] = (query as string).includes("BUY") ? item?.rate_per_g_wo_gst : item?.aura_sell_price;
              return row;
            });
          });
        }
      }
    } catch (e) {
      console.error(e);
      if (e?.response?.data?.message) {
        toast({
          title: "Error",
          description: e?.response?.data?.message,
        });
      }
    }
  }, [
    // currentPage,
    // limit,
    status,
    // url,
    // date.startDate,
    // date.endDate,
    // columns,
    search.product_name,
  ]);

  useEffect(() => {
    fetchList();
  }, [fetchList,token]);

  return {
    fetchList,
    setCurrentPage,
    currentPage,
    limit,
    setLimit,
    setStatus,
    totalPages,
    data,
    handleSelect,
    setIsOpen,
    isOpen,
    currentTransaction,
    status,
    date,
    setDate,
    search,
    setSearch,
  };
};
