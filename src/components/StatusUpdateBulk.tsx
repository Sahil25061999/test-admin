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
import { PageHeader } from "./dashboard/PageHeader";

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
  const router = useRouter();
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
    setIsOpen(false);

    try {
      for (const currTxn of txn) {
        const res = await apiInstance.get(successUrl, {
          params: {
            txn_id: currTxn.key,
            new_status: status,
          },
        });

        console.log("STATUS==>", res);


        if (!res.data.success) {
          openNotificationWithIcon(
            "error",
            "Update Failed",
            res.data.message || "Status update failed"
          );
          continue;
        }


        removeTxn(currTxn);

        openNotificationWithIcon(
          "success",
          "Success",
          `Transaction ${currTxn.key} updated`
        );
      }
      setTimeout(() => {
        router.back();
      }, 2000)

    } catch (error: any) {
      console.error(error);

      openNotificationWithIcon(
        "error",
        "Server Error",
        error?.response?.data?.message || "Something went wrong"
      );
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
      <PageHeader title="Bulk Status Update" />
      {contextHolder}
      <div className=" relative  h-fit">
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
              <Select.Option className=" bg-white" value="SHIPPED">
                Shipped
              </Select.Option>
              <Select.Option className=" bg-white" value="DELIVERED">
                Delivered
              </Select.Option>
            </>
          )}



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
