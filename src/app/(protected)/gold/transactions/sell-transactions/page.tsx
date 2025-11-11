"use client";

import { useState, Fragment, useEffect, useMemo } from "react";
// import { Table } from "antd";
import { Dialog, Transition } from "@headlessui/react";
import { useFetchList } from "../../../../../hooks/useFetchList";
import { SELL_TXN_COLUMNS as columns, SELL_TXN_COLUMNS } from "../../../../../constants/index.constants";
import { useRouter } from "next/navigation";
import { CHRYSUS_API } from "../../../../../config";
import { useToast } from "../../../../../context/toast.context";
import { Table } from "../../../../../components/Table";
import { useTable } from "../../../../../hooks/useTable";
import { ArrowDownIcon, PencilIcon } from "@heroicons/react/24/outline";
import { useBulkTxn } from "../../../../../context/bulkTxn.context";
import { CSVLink } from "react-csv";
import { useAuthAxios } from "../../../../../hooks/useAuthAxios";

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
  } = useFetchList({ url: "/transaction/v1/processing/txns?product_name=GOLD24&", columns });

  const { rowSelection, selectedRowKeys } = useTable();
  const [processing, setProcessing] = useState(false);
  const { updateBulkTxn } = useBulkTxn();
    const apiInstance = useAuthAxios()
  
  const closeModal = () => {
    setIsOpen(() => false);
  };

  const approveStatus = async () => {
    let token: string;
    if (typeof window !== undefined) {
      token = localStorage.getItem("token");
    }
    setIsOpen(() => false);
    let res;
    try {
      if (currentTransaction.statusToSet === "CANCELLED") {
        res = await apiInstance.get("admin/v1/sell-txn/cancel", {
          params: {
            txn_id: currentTransaction.external_txn_id,
            // user_id: currentTransaction.user.id,
          },
        });
      } else {
        res = await apiInstance.get("transaction/v1/execute/txns", {
          params: {
            txn_id: currentTransaction.external_txn_id,
            new_status: currentTransaction.statusToSet,
            notes,
          },
        });
      }
      fetchList();
    } catch (e) {
      console.error(e);
      if (e?.response?.message) {
        toast({ description: e?.response?.message });
      } else {
        toast({ description: "Something went wrong" });
      }
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
      const res = await apiInstance.get(`/invoices/${txnid}`);
      if (res?.data?.success) {
        // document.location.href = res.data.data[0].downloadLink
        window.open(res.data.data[0].downloadLink, "_blank").focus();
        // router.push(res.data.data[0].downloadLink, { _target: "blank" });
      }
    } catch (e) {
      if (e?.response?.message) {
        toast({
          title: "Error",
          description: e.reponse.message,
        });
      } else {
        toast({
          title: "Error",
          description: "Something went wrong",
        });
      }
    }
  }

  async function handleBulkUpdate() {
    updateBulkTxn(selectedData);
    router.push("sell-transactions/status-update");
    // localStorage.setItem("bulk-update-id", JSON.stringify(selectedData));
  }

  async function handleDownloadData() {}

  useEffect(() => {
    setSearch((prev) => ({ ...prev, product_name: "GOLD24" }));
  }, []);

  const selectedData = useMemo(() => {
    return data.filter(({ key }) => selectedRowKeys.includes(key));
  }, [selectedRowKeys]);

  const handleProcessSellTxn = async () => {
    try {
      setProcessing(true);
      const res = await apiInstance.get("/admin/v1/process_sell_order_transactions");
      if (res?.data?.success) {
        window.open(res?.data?.data?.successful_transactions?.bank_url, "_blank");
        window.open(res?.data?.data?.successful_transactions?.upi_url, "_blank");
      }
    } catch (e) {
    } finally {
      setProcessing(false);
    }
  };

  const headers = SELL_TXN_COLUMNS.map((item) => {
    if (["Beneficiary's UPI ID"].includes(item.title)) {
      return { label: item.title, key: "upi" };
    }
    if (["Beneficiary Name"].includes(item.title)) {
      return { label: item.title, key: "name" };
    }
    if ("Phone Number" === item.title) {
      return { label: item.title, key: "phone" };
    }
    if ("Contact Reference ID" === item.title) {
      return { label: item.title, key: "userid" };
    }
    if ("Email ID" === item.title) {
      return { label: item.title, key: "email" };
    }
    return { label: item.title, key: item.dataIndex };
  });

  return (
    <>
      <div className="relative overflow-x-auto">
        <h1>Sell Orders</h1>
      </div>
      <div className=" flex gap-x-2">
        <button
        
          className="my-4 p-4 bg-purple-500 text-white font-medium rounded-full col-span-full"
          onClick={handleProcessSellTxn}
        >
          {processing ? "Processing":"Process sell txn"}
        </button>

        {selectedRowKeys && selectedRowKeys.length > 0 ? (
          <>
            <button
              onClick={handleBulkUpdate}
              className=" flex items-center gap-x-1 p-4 bg-purple-500 rounded-full text-white font-semibold my-3"
            >
              <div className=" bg-white rounded-full p-1">
                <PencilIcon color="#333" height={20} width={20} />
              </div>
              <span className=" inline-block">Bulk Update Status</span>
            </button>

            {/* <CSVLink data={selectedData.map(item=>({...item,upi:item.meta_data?.vpa,name:item.user.first_name+ " "+item.user.last_name,phone:item.user.phone_number,userid:item.user.id,email:item.user.email}))} headers={headers}>

        <button onClick={handleBulkUpdate} className=" flex items-center gap-x-1 p-4 bg-purple-500 rounded-full text-white font-semibold my-3">
          <div  className=" bg-white rounded-full p-1">
            
            <ArrowDownIcon color="#333" height={20} width={20}/></div>
          <span className=" inline-block">Download Data</span>
        </button>
        </CSVLink> */}
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
      <section className="w-full relative overflow-x-auto">
        <Table
          rowSelection={rowSelection}
          columns={columns}
          data={data}
          onChange={handleFilters}
          // pagination={handlePagination}
        />
      </section>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10 " onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full dark:bg-slate-800 max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                    Status Update
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      Are you sure you want to update the transaction status ?
                    </p>
                  </div>

                  <textarea
                    style={{ resize: "none" }}
                    className="mt-2 w-full dark:bg-slate-800 max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
                    onChange={(e) => setNotes(() => e.target.value)}
                  ></textarea>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-lime-700 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => approveStatus()}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 mx-3"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
