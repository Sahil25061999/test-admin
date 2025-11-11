"use client";

import { useState, Fragment, useMemo } from "react";
import axios from "axios";
import { Dialog, Transition } from "@headlessui/react";
import { useFetchList } from "../../../../../hooks/useFetchList";
import { GOLD_REDEMPTION_TXN_COLUMNS as columns } from "../../../../../constants/index.constants";
import { DateFilter, TransactionSearch } from "../../../../../components/index.component";
import { useRouter } from "next/navigation";
import { CHRYSUS_API, MOI_API } from "../../../../../config";
import { useToast } from "../../../../../context/toast.context";
import { ArrowDownIcon, Bars2Icon, PencilIcon } from "@heroicons/react/24/outline";
import { useBulkTxn } from "../../../../../context/bulkTxn.context";
import { useTable } from "../../../../../hooks/useTable";
import { Table } from "../../../../../components/Table";
import SilverRedemption from "../../../../../components/silver-redemption";
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
  } = useFetchList({ url: "/redemption/v1/status/txns?product_name=SILVER24&txn_status=PROCESSING&", columns });

  const { selectedRowKeys, rowSelection } = useTable();
  const { updateBulkTxn } = useBulkTxn();
  const closeModal = () => {
    setIsOpen(() => false);
  };
  const apiInstance = useAuthAxios()

  const approveStatus = async () => {
    let token: string;
    // if (typeof window !== undefined) {
    //   token = localStorage.getItem("token");
    // }
    setIsOpen(() => false);
    // console.log(currentTransaction);
    try {
      const res = await apiInstance.get("redemption/v1/execute/txns?product_name=SILVER24", {
        params: {
          txn_id: currentTransaction.transaction.txn_id,
          new_status: currentTransaction.statusToSet,
          notes,
        },
      });
      // console.log("STATUS==>", res);
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
    router.push("gold-redemption/status-update");
    // localStorage.setItem("bulk-update-id", JSON.stringify(selectedData));
    updateBulkTxn(selectedData);
  }

  const selectedData = useMemo(() => {
    return data.filter(({ key }) => selectedRowKeys.includes(key));
  }, [selectedRowKeys]);

  return (
    <>
      <SilverRedemption/>
    </>
  );
}



{/* <div>
        <h1>Silver Redemption</h1>
      </div>

      <div className=" flex gap-x-2">
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
      <section className="relative overflow-x-auto w-full">
        <Table
          rowSelection={rowSelection}
          columns={columns as any}
          data={data}
          // onChange={handleFilters}
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
      </Transition> */}