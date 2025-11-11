"use client";
import React, { Fragment, useMemo } from "react";
import { Table } from "antd";
import "./page.module.css";
import axios from "axios";
import { Dialog, Listbox, Transition } from "@headlessui/react";
import { useFetchList } from "../../../hooks/useFetchList";
import { BUY_TXN_COLUMNS } from "../../../constants/index.constants";
import { DateFilter } from "../../../components/dateFilter";
import { TransactionSearch } from "../../../components/transactionSearch";
import { CHRYSUS_API, MOI_API } from "../../../config";
import { useToast } from "../../../context/toast.context";

export default function Page() {
  const columns = useMemo(
    () => [
      ...BUY_TXN_COLUMNS,
      {
        title: "Invoice",
        dataIndex: "",
        key: "x",
        render: (text, record) => {
          return (
            <button
              className=" text-primary"
              onClick={() => handleDownloadInvoice(record["Id"])}
            >
              Download Invoice
            </button>
          );
        },
      },
    ],
    []
  );
  const {
    totalPages,
    limit,
    setLimit,
    status,
    currentPage,
    setCurrentPage,
    data,
    isOpen,
    setIsOpen,
    fetchList,
    currentTransaction,
    setStatus,
    date,
    setDate,
    search,
    setSearch,
  } = useFetchList({ url: "admin/transaction_list_new", columns });
  const {toast} = useToast()

  const closeModal = () => {
    setIsOpen(() => false);
  };

  const approveStatus = async () => {
    setIsOpen(() => false);
    let token;
    if (typeof window !== undefined) {
      token = localStorage.getItem("token");
    }
    try {
      const res = await MOI_API.post(
        "admin/toggle_transaction_status/" + currentTransaction?.txnid,
        {
          newStatus: currentTransaction?.statusToSet,
        },
        {
          headers: { authorization: token },
        }
      );
      fetchList();
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
  };

  async function handleDownloadInvoice(txnid) {
    try {
      const res = await CHRYSUS_API.get(`/invoices/${txnid}`);
      console.log(res);
      if (res?.data?.success) {
        window.open(res.data.data[0].downloadLink, "_blank").focus();
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

  return (
    <>
      <h1 className=" font-bold">Buy Orders</h1>
      <div className="flex items-start p-4 gap-5 mb-4 mt-4 rounded-[2rem] border dark:border-white relative">
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
      </div>
      <section>
        {/* <ConfigProvider
          theme={{
            token: {
              colorText: "white",
              colorTextDisabled: "white",
              colorPrimary: "white",
              colorBgContainer: "#262148",
              colorBgBase: "#7e3ead",
              colorIcon: "white",
              colorPrimaryBgHover: "#262148",
              colorPrimaryBg: "#262148",

              colorBgElevated:"red"
            },
          }}
         > */}
        <Table
          className="ant-table-tbody ant-table"
          rootClassName={"table_paginator"}
          columns={columns}
          dataSource={data}
          onChange={(pagination, filters) => {
            // fetchList(filters.Status[0])
            if (status.length == 0 && !filters?.Status) return;
            let existingStatus = status.sort();
            let newFilteredStatus = filters.Status?.sort();
            if (
              JSON.stringify(existingStatus) ===
              JSON.stringify(newFilteredStatus)
            )
              return;
            setStatus(() => (filters.Status ? filters.Status : []));
            setCurrentPage(() => 1);
            setLimit(() => 10);
          }}
          pagination={{
            total: totalPages * limit,
            onChange(page, pageSize) {
              setCurrentPage(() => page);
              setLimit(() => pageSize);
            },
          }}
        />
        {/* </ConfigProvider> */}
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
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                  >
                    Status Update
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      Are you sure you want to update the transaction status ?
                    </p>
                  </div>
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
