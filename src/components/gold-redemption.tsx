"use client";

import { useState, Fragment, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowDownIcon, PencilIcon } from "@heroicons/react/24/outline";

import { useFetchList } from "../hooks/useFetchList";
import { GOLD_REDEMPTION_TXN_COLUMNS as columns } from "../constants/index.constants";
import { useToast } from "../context/toast.context";
import { useTable } from "../hooks/useTable";
import { Table } from "../components/Table";
import { Modal } from "../components/Modal/Modal";
import { useBulkTxn } from "../context/bulkTxn.context";
import { PageHeader } from "./dashboard/PageHeader";
import InputField from "./ui/InputField";

export default function Page() {
  const [notes, setNotes] = useState("");
  const [processing, setProcessing] = useState(false);

  const { toast } = useToast();
  const router = useRouter();


  const {
    totalPages,
    limit,
    setLimit,
    currentPage,
    setCurrentPage,
    data,
    isOpen,
    setIsOpen,
    fetchList,
    currentTransaction,
    status,
    setStatus,
    date,
    setDate,
    search,
    setSearch, loading
  } = useFetchList({
    url: "/redemption/v1/status/txns?metal_type=gold&",
    columns,
  });


  console.log(data?.map((item) => item.key + " " + item?.transaction?.status), "DATAAA-GOLD")



  const { selectedRowKeys, rowSelection } = useTable();
  const { updateBulkTxn } = useBulkTxn();

  const closeModal = () => {
    setIsOpen(false);
  };

  const approveStatus = async () => {
    setIsOpen(false);
    let res;

    try {
      if (currentTransaction.statusToSet === "CANCELLED") {
        const params = {
          action: "cancel",
          txn_id: currentTransaction.transaction.txn_id,
        };
        res = await fetch(`/api/redemption?${new URLSearchParams(params)}`);
      } else {
        const params = {
          action: "execute",
          product_name: "GOLD24",
          txn_id: currentTransaction.transaction.txn_id,
          new_status: currentTransaction.statusToSet,
          notes,
        };
        res = await fetch(`/api/redemption?${new URLSearchParams(params)}`);
      }

      const result = await res.json();
      console.log(result, "RESULT_MANUAL_UPDATE")

      if (result?.success) {
        toast({ title: result?.message || "Status Updated", description: result?.message || "Something went wrong", variant: "success" });
        fetchList();
      } else {
        toast({ description: result?.message || "Something went wrong" });
      }
    } catch (e) {
      console.error(e);
      toast({ description: "Something went wrong" });
    }
  };

  const handleFilters = (_pagination, filters) => {
    if (status.length === 0 && !filters?.Status) return;

    const existingStatus = [...status].sort();
    const newStatus = filters?.Status?.sort();

    if (JSON.stringify(existingStatus) === JSON.stringify(newStatus)) return;

    setStatus(filters?.Status || []);
    setCurrentPage(1); // reset page on filter change
  };

  const handlePagination = {
    total: totalPages * limit,
    current: currentPage,
    pageSize: limit,
    showSizeChanger: true,
    onChange(page, pageSize) {
      setCurrentPage(page);
      setLimit(pageSize);
    },
  };

  const handleProcessSellTxn = async () => {
    try {
      setProcessing(true);
      const res = await fetch(`/api/redemption?${new URLSearchParams({ action: "process" })}`);
      const result = await res.json();

      if (result?.success) {
        window.open(result.data?.url?.s3_url, "_blank");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  const selectedData = useMemo(() => {
    return data.filter(({ key }) => selectedRowKeys.includes(key));
  }, [data, selectedRowKeys]);

  const handleBulkUpdate = () => {
    updateBulkTxn(selectedData);
    router.push("gold-redemption/status-update");
  };

  return (
    <>
      <PageHeader title="Gold Redemption" subtitle="Manage gold redemption transactions" />

      <div className="flex justify-end gap-x-2">

        <button
          className="my-4 p-4 bg-primary text-white font-medium rounded-md"
          onClick={handleProcessSellTxn}
        >
          {processing ? "Processing..." : "Process redemption Txn"}
        </button>

        {selectedRowKeys.length > 0 && (
          <>
            <button
              onClick={handleBulkUpdate}
              className="my-4 p-4 bg-primary text-white font-medium rounded-md"
            >

              <span>Bulk Update Status</span>
            </button>

          </>
        )}
      </div>

      <section className="relative overflow-x-auto w-full">
        <Table
          rowSelection={rowSelection}
          columns={columns as any}
          data={data}
          pagination={handlePagination}
          onChange={handleFilters}
          loading={loading}
        />
      </section>

      <Modal
        question="Update Status ?"
        isOpen={isOpen}
        closeModal={closeModal}
        action={approveStatus}
      />
    </>
  );
}
