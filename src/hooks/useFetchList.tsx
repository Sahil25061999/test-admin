"use client";

import { useCallback, useEffect, useState } from "react";
import { Typography } from "antd";
import { useToast } from "../context/toast.context";
import { useAuth } from "../context/auth";

export const useFetchList = ({ url, columns }) => {
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false)

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
  const { token } = useAuth();

  const handleSelect = (value, transaction) => {
    setIsOpen(true);
    setCurrentTransaction({ ...transaction, statusToSet: value });
  };

  const fetchList = useCallback(async () => {
    try {
      const query = new URLSearchParams({
        txn_type: "BUY",
        offset: ((currentPage - 1) * limit).toString(),
        limit: limit.toString(),
        startdate: date.startDate || "",
        enddate: date.endDate || "",

      }).toString();
      const apiUrl = `/api/transactions?url=${encodeURIComponent(url)}&${query}`;
      console.log("API URL", apiUrl);
      setLoading(true)
      const res = await fetch(apiUrl);


      const result = await res.json();

      if (!result?.success) return;

      setTotalPages(result.data.total_pages || 0);


      if (url.includes("redemption")) {
        const rows = result.data.transactions.map((item) => {
          const txnStatus = item.transaction.txn_status;

          const statusNode =
            [
              "PROCESSING",
              "AWAITING PICKUP",
              "SHIPPED",
              "IN-TRANSIT",
              "OUT FOR DELIVERY",
              "ORDER SUCCESSFUL",
            ].includes(txnStatus) ? (
              <select
                className="bg-transparent"
                value={txnStatus}
                onChange={(e) => handleSelect(e.target.value, item)}
              >
                <option disabled hidden value={txnStatus}>
                  {txnStatus}
                </option>

                <option value="ORDER SUCCESSFUL">Order Successful</option>

                <option value="SHIPPED">Shipped</option>

                <option value="DELIVERED">Delivered</option>
              </select>
            ) : (
              txnStatus
            );

          return {
            ...item,
            transaction: {
              ...item.transaction,
              txn_status: statusNode,
              status: txnStatus
            },
            key: item.transaction.txn_id,
          };
        });

        setData(rows);
        return;
      }

      /** ---------------- NORMAL TRANSACTION FLOW ---------------- */
      const rows = result.data.transactions.map((item) => {
        const statusNode =
          item.txn_status === "PROCESSING" ? (
            <select
              className="bg-transparent"
              value={item.txn_status}
              onChange={(e) => handleSelect(e.target.value, item)}
            >
              <option disabled hidden value={item.txn_status}>
                {item.txn_status}
              </option>
              <option value="SUCCESS">SUCCESS</option>
              <option value="FLAGGED">FLAGGED</option>
            </select>
          ) : (
            item.txn_status
          );

        return {
          key: item.external_txn_id,
          "Transaction Id": item.external_txn_id,
          Quantity: item.qty_g,
          Amount: item.total_value_rs,
          Date: new Date(item.created_at).toLocaleString(),
          user: item.user,
          meta_data: item.meta_data,
          Status: statusNode,
          Notes: <Typography.Text>{item.notes}</Typography.Text>,
          Rates:
            item.txn_type === "BUY"
              ? item.rate_per_g_wo_gst
              : item.aura_sell_price,
        };
      });

      setData(rows);
    } catch (e) {
      console.error(e);
      setLoading(false)
      toast({
        title: "Error",
        description: "Something went wrong",
      });
    } finally {
      setLoading(false)
    }
  }, [
    currentPage,
    limit,
    url,
    date.startDate,
    date.endDate,
    status,
    search.product_name,
  ]);

  useEffect(() => {
    fetchList();
  }, [fetchList, token]);

  return {
    fetchList,
    currentPage,
    setCurrentPage,
    limit,
    setLimit,
    totalPages,
    data,
    status,
    setStatus,
    date,
    setDate,
    search,
    setSearch,
    isOpen,
    setIsOpen,
    currentTransaction,
    loading
  };
};
