"use client";

import { Popconfirm, Table, Tag, Typography } from "antd";
import { Dialog, Listbox, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { UpiUserSearch } from "../../../components/index.component";
import { MOI_API } from "../../../config";
import { useToast } from "../../../context/toast.context";

const columns = [
  {
    title: "Sr.No.",
    dataIndex: "Sr.No.",
    key: "Sr.No.",
  },
  {
    title: "Upi Id",
    dataIndex: "_id",
    key: "_id",
  },
  {
    title: "Upi",
    dataIndex: "upi",
    key: "upi",
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
  },
];

export default function Page() {
  const [upi, setUpi] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const [data, setData] = useState([]);

  const blockUpi = async () => {
    let token: string;

    setIsOpen(() => false);
    if (typeof window !== undefined) {
      token = localStorage.getItem("token");
    }
    try {
      const res = await MOI_API.post(
        "admin/upis/block",
        { upi },
        { headers: { Authorization: token } }
      );
      if (res.data.success) {
        fetchBlockedUpiLists();
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
  };

  const unblockUpi = async (upi) => {
    let token: string;
  
    if (typeof window !== undefined) {
      token = localStorage.getItem("token");
    }
    try {
      const res = await MOI_API.post(
        "admin/upis/unblock",
        { upi },
        { headers: { Authorization: token } }
      );
      if (res.data.success) {
        fetchBlockedUpiLists();
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
  };

  const openConfirmationModal = async (e) => {
    e.preventDefault();
    setIsOpen(() => true);
  };

  const closeModal = () => {
    setIsOpen(() => false);
  };

  const fetchBlockedUpiLists = async () => {
    let token: string;

    if (typeof window !== undefined) {
      token = localStorage.getItem("token");
    }

    try {
      const res = await MOI_API.get("admin/upis/block", {
        headers: { Authorization: token },
      });
      if (res.data.success) {
        setData(() => {
          return res?.data?.data.map((item: { upi: string }, index) => {
            return {
              key: index,
              ...item,
              action: (
                <button onClick={() => unblockUpi(item.upi)}>Unblock</button>
              ),
            };
          });
        });
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
  };

  useEffect(() => {
    fetchBlockedUpiLists();
  }, []);

  return (
    <div>
      <UpiUserSearch
        placeholder={"Enter upi"}
        input={upi}
        setInput={setUpi}
        handleSubmit={openConfirmationModal}
      />
      <h1>Blocked Upi&apos;s</h1>
      <section className="mt-4">
        <Table
          className="ant-table-tbody"
          rootClassName={"table_paginator"}
          columns={columns}
          dataSource={data}
          // onChange={(pagination, filters) => {
          //   if (status.length == 0 && !filters?.Status) return;
          //   let existingStatus = status.sort();
          //   let newFilteredStatus = filters.Status?.sort();
          //   if (
          //     JSON.stringify(existingStatus) ===
          //     JSON.stringify(newFilteredStatus)
          //   )
          //     return;
          //   setStatus(() => (filters.Status ? filters.Status : []));
          //   console.log("page set");
          //   setCurrentPage(() => 1);
          //   setLimit(() => 10);
          // }}
          // pagination={{
          //   total: totalPages * limit,
          //   onChange(page, pageSize) {
          //     console.log("page set2");
          //     setCurrentPage(() => page);
          //     setLimit(() => pageSize);
          //   },
          // }}
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
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                  >
                    Status Update
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      Are you sure you want to block the upi {upi}?
                    </p>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-lime-700 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => blockUpi()}
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
    </div>
  );
}
