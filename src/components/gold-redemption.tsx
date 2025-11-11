"use client";

import { useState, Fragment, useMemo } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useFetchList } from "../hooks/useFetchList";
import { GOLD_REDEMPTION_TXN_COLUMNS as columns } from "../constants/index.constants";
import { useRouter } from "next/navigation";
import { useToast } from "../context/toast.context";
import { ArrowDownIcon, PencilIcon } from "@heroicons/react/24/outline";
import { useTable } from "../hooks/useTable";
import { Table } from "../components/Table";
import { Modal } from "../components/Modal/Modal";
import { useBulkTxn } from "../context/bulkTxn.context";

export default function Page() {
  const [notes, setNotes] = useState("");
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
    setSearch,
  } = useFetchList({ url: "/redemption/v1/status/txns?product_name=GOLD24&txn_status=PROCESSING&", columns });
  const { selectedRowKeys, rowSelection } = useTable();
  const [processing, setProcessing] = useState(false);
  
  const closeModal = () => {
    setIsOpen(() => false);
  };
  const { updateBulkTxn } = useBulkTxn();
  const approveStatus = async () => {
    setIsOpen(() => false);
    let res;
    try {
      if (currentTransaction.statusToSet === "CANCELLED") {
        const params = {
          action: 'cancel',
          txn_id: currentTransaction.transaction.txn_id,
        };
        const searchParams = new URLSearchParams(params);
        res = await fetch(`/api/redemption?${searchParams.toString()}`);
      } else {
        const params = {
          action: 'execute',
          product_name: 'GOLD24',
          txn_id: currentTransaction.transaction.txn_id,
          new_status: currentTransaction.statusToSet,
          notes,
        };
        const searchParams = new URLSearchParams(params);
        res = await fetch(`/api/redemption?${searchParams.toString()}`);
      }

      const data = await res.json();
      if (data?.success) {
        fetchList();
      } else {
        toast({ description: data?.message || "Something went wrong" });
      }
    } catch (e) {
      console.error(e);
      toast({ description: "Something went wrong" });
    }
  };

  const handleFilters = (pagination, filters) => {
    if (status.length == 0 && !filters?.Status) return;
    let existingStatus = status.sort();
    let newFilteredStatus = filters.Status?.sort();
    if (JSON.stringify(existingStatus) === JSON.stringify(newFilteredStatus)) return;
    setStatus(() => (filters.Status ? filters.Status : []));
    // console.log("page set");
    // setCurrentPage(() => 1);
    // setLimit(() => 10);
  };

  const handlePagination = {
    total: totalPages * limit,
    onChange(page, pageSize) {
      // console.log("page set2");
      setCurrentPage(() => page);
      setLimit(() => pageSize);
    },
  };

  async function handleDownloadInvoice(txnid) {
    try {
      const res = await fetch(`/api/invoices/${txnid}`);
      const data = await res.json();
      if (data?.success) {
        window.open(data.data[0].downloadLink, "_blank").focus();
      }
    } catch (e) {
      toast({
        title: "Error",
        description: "Something went wrong",
      });
    }
  }

  async function handleBulkUpdate() {
    router.push("gold-redemption/status-update");
    // localStorage.setItem("bulk-update-id", JSON.stringify(selectedData));
    updateBulkTxn(selectedData)
  }

  async function handleDownloadData(){

  }

  const handleProcessSellTxn = async () => {
    try {
      setProcessing(true);
      const params = { action: 'process' };
      const searchParams = new URLSearchParams(params);
      const res = await fetch(`/api/redemption?${searchParams.toString()}`);
      const data = await res.json();
      if (data?.success) {
        window.open(data.data?.url?.s3_url, "_blank");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  const selectedData = useMemo(()=>{
    return data.filter(({key})=> selectedRowKeys.includes(key))
  },[selectedRowKeys])
  // console.log(selectedData)

  return (
    <>
      <div>
        <h1>Gold Redemption</h1>
      </div>
      <div className=" flex gap-x-2">
      <button
        
        className="my-4 p-4 bg-purple-500 text-white font-medium rounded-full col-span-full"
        onClick={handleProcessSellTxn}
      >
        {processing ? "Processing":"Process redemption txn"}
      </button>
      {selectedRowKeys && selectedRowKeys.length > 0 ? (
        <><button onClick={handleBulkUpdate} className=" flex items-center gap-x-1 p-4 bg-purple-500 rounded-full text-white font-semibold my-3">
          <div  className=" bg-white rounded-full p-1"><PencilIcon color="#333" height={20} width={20}/></div>
          <span className=" inline-block">Bulk Update Status</span>
        </button>
        <button onClick={handleBulkUpdate} className=" flex items-center gap-x-1 p-4 bg-purple-500 rounded-full text-white font-semibold my-3">
          <div  className=" bg-white rounded-full p-1">
            
            <ArrowDownIcon color="#333" height={20} width={20}/></div>
          <span className=" inline-block">Download Data</span>
        </button>
       </>
      ) : null}
      </div>
      {/* <div className="flex items-start p-4 gap-5 mb-4 mt-8 rounded-3xl border dark:border-[#313638] relative">
        <div className="absolute -top-3 left-6 dark:bg-black px-3">
          <h2 className=" text-lg font-medium">Filters</h2>
        </div>
        <DateFilter date={date} setDate={setDate} />
        <TransactionSearch
          search={search}
          setSearch={setSearch}
          setLimit={setLimit}
          setCurrentPage={setCurrentPage}
        />
      </div> */}
      <section className="relative overflow-x-auto w-full">
        
        <Table
          rowSelection={rowSelection}
          columns={columns as any}
          data={data}
          // onChange={handleFilters}
          // pagination={handlePagination}
        />
      </section>

      <Modal question={"Update Status ?"} isOpen={isOpen} closeModal={closeModal} action={approveStatus} />
    </>
  );
}
