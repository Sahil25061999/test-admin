"use client";
import { Select } from "antd";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { CHRYSUS_API } from "../config";
import { useToast } from "../context/toast.context";
import { Dialog, Transition } from "@headlessui/react";
import { Modal } from "../components/Modal/Modal";
import { Table } from "../components/Table";
import { GOLD_REDEMPTION_TXN_COLUMNS } from "../constants/transactions.constants";
import { usePathname, useRouter } from "next/navigation";
import { useBulkTxn } from "../context/bulkTxn.context";
import { notification } from "antd";
import { title } from "process";
import { useAuthAxios } from "../hooks/useAuthAxios";

type NotificationType = "success" | "info" | "warning" | "error";
async function timeout() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("");
    }, 2000);
  });
}

export function StatusUpdateBulk({ cancelUrl, successUrl, columnFormat }) {
  const [isOpen, setIsOpen] = useState(false);
  // const [txn, setTxn] = useState(null);
  const { bulkTxnList: txn, removeTxn } = useBulkTxn();
  const [api, contextHolder] = notification.useNotification();
  const apiInstance = useAuthAxios()

  const [status, setStatus] = useState("");
  const { toast } = useToast();
  const column = useMemo(() => {
    return columnFormat.filter((column) => column.title !== "Status");
  }, []);
  const onChange = (value: string) => {
    setStatus(value);
    setIsOpen(true);
    // approveStatus(value)
  };

  const closeModal = () => {
    setIsOpen(() => false);
  };
  const pathname = usePathname();

  const openNotificationWithIcon = (type: NotificationType, title: string, description: string) => {
    api[type]({
      message: title,
      description: description,
    });
  };

  const approveStatus = async () => {
    let token: string;
    // if (typeof window !== undefined) {
    //   token = localStorage.getItem("token");
    // }
    setIsOpen(() => false);

    let res;
    try {
      if (status === "CANCELLED") {
        for (let i = 0; i < txn.length; i++) {
          res = await apiInstance.get(cancelUrl, {
            params: {
              txn_id: txn[i].key,
              // user_id: currentTransaction.user.id,
            },
          });
        }
      } else {
        txn.forEach(async (currTxn) => {
          res = await apiInstance.get(successUrl, {
            params: {
              txn_id: currTxn.key,
              new_status: status,
            },
          });
          // console.log("STATUS==>", res);
          if (res.data.success) {
            removeTxn(currTxn);
            openNotificationWithIcon("success","Success",`Status update for Transaction ${res.config.params.txn_id}` )
            // toast({ description: , variant: "success" });
            // setTxn((prev) => prev.slice(i + 1, txn.length));
          }
        });

        // localStorage.removeItem("bulk-update-id");
      }
    } catch (e) {
      console.error(e);
      if (e?.response?.message) {
        toast({ description: e?.response?.message });
      } else {
        toast({ description: "Something went wrong" });
      }
    }
  };

  // useEffect(() => {
  //   const txnId = JSON.parse(localStorage.getItem("bulk-update-id"));
  //   setTxn(txnId);
  //   // localStorage.removeItem("bulk-update-id");
  // }, []);
  // console.log(pathname, txn);
  return (
    <div className=" relative">
      {contextHolder}
      <div className=" relative  h-fit">
        <h2 className=" sticky top-0 font-semibold text-lg">Transactions</h2>
        <Select disabled={txn?.length == 0} className=" h-fit my-4" defaultValue={"PROCESSING"} onChange={onChange}>
          <Select.Option disabled value="PROCESSING">
            PROCESSING
          </Select.Option>
          <Select.Option value="SUCCESS">SUCCESS</Select.Option>
          {pathname.includes("sell") ? null : (
            <>
              <Select.Option className=" bg-white" value="ORDER SUCCESSFUL">
                Order Successful
              </Select.Option>
              <Select.Option className=" bg-white" value="AWAITING PICKUP">
                Awaiting Pickup
              </Select.Option>
              <Select.Option className=" bg-white" value="SHIPPED">
                Shipped
              </Select.Option>
              <Select.Option className=" bg-white" value="IN-TRANSIT">
                In-Transit
              </Select.Option>
              <Select.Option className=" bg-white" value="OUT FOR DELIVERY">
                Out for Delivery
              </Select.Option>
              <Select.Option className=" bg-white" value="DELIVERED">
                Delivered
              </Select.Option>
            </>
          )}

          <Select.Option value="FLAGGED">FLAGGED</Select.Option>
        </Select>
        {/* {txn?.map((txnId) => (
          <h4 className=" my-2">{txnId.key}</h4>
        ))} */}
        {txn && txn.length > 0 ? <Table data={txn} columns={column} /> : null}
      </div>

      <Modal question={"Update Status ?"} isOpen={isOpen} closeModal={closeModal} action={approveStatus} />
    </div>
  );
}
