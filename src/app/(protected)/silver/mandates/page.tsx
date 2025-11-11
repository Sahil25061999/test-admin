"use client";

import React, { useState, Fragment, useEffect, useCallback } from "react";
import { Table } from "antd";
import { Dialog, Transition } from "@headlessui/react";
import { mandatesColumns as columns } from "../../../../constants/index.constants";
import { DateFilter } from "../../../../components/dateFilter";
import { TransactionSearch } from "../../../../components/transactionSearch";
import { CHRYSUS_API } from "../../../../config";
import { useToast } from "../../../../context/toast.context";
import { Bars2Icon } from "@heroicons/react/24/outline";
import { useAuthAxios } from "../../../../hooks/useAuthAxios";
interface MandateDetails {
  id?: string;
  statusToSet?: string;
}

export default function Page() {
  const [notes, setNotes] = useState("");
  const [data, setData] = useState([]);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState([]);
  const [selectedMandateDetails, setSelectedMandateDetails] =
    useState<MandateDetails>({});
  const [date, setDate] = useState({
    startDate: "",
    endDate: "",
  });
  const [search, setSearch] = useState({
    name: "",
    phone: "",
    txnid: "",
  });
  const { toast } = useToast();
    const apiInstance = useAuthAxios()
  
  // const {
  //   totalPages,
  //   limit,
  //   setLimit,
  //   currentPage,
  //   setCurrentPage,
  //   data,
  //   isOpen,
  //   setIsOpen,
  //   fetchList,
  //   currentTransaction,
  //   status,
  //   setStatus,
  //   date,
  //   setDate
  // } = useFetchList({ url: "admin/sell_orders_new", columns });
  const handleStatusChange = (status, currentMandate) => {
    setIsOpen(() => true);
    setSelectedMandateDetails(() => ({
      ...currentMandate,
      statusToSet: status,
    }));
  };

  const fetchMandates = useCallback(async () => {
    try {
      let query = new URLSearchParams({
        name: search.name,
        phone: search.phone,
        txnid: search.txnid,
        page: currentPage.toString(),
        limit: limit.toString(),
        status: status.join(","),
        startdate: date.startDate,
        enddate: date.endDate,
      }) as unknown;
      query = query.toString();
      const res = await apiInstance.get(`/mandates?${query}`);
      if (res?.data?.success) {
        setTotalPages(() => res.data.data.totalPages);
        setData(() => {
          return res.data.data.result.map((mandate) => {
            return {
              ...mandate,
              createdAt: new Date(mandate.createdAt).toLocaleString(),
              status:
                mandate.status === "ACTIVE" ? (
                  <select
                    className=" bg-transparent"
                    value={mandate.status}
                    onChange={(e) =>
                      handleStatusChange(e.target.value, mandate)
                    }
                  >
                    <option value={mandate.status} hidden selected disabled>
                      {mandate.status}
                    </option>
                    <option className=" bg-black" value={"REVOKED"}>
                      REVOKED
                    </option>
                  </select>
                ) : (
                  mandate.status
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
  }, [
    currentPage,
    limit,
    date.startDate,
    date.endDate,
    status,
    search.phone,
    search.txnid,
    search.name,
  ]);

  const closeModal = () => {
    setIsOpen(() => false);
  };

  const approveStatus = async () => {
    // let token: string;
    // if (typeof window !== undefined) {
    //   token = localStorage.getItem("token");
    // }
    setIsOpen(() => false);
    try {
      if (selectedMandateDetails.id && selectedMandateDetails.statusToSet) {
        const res = await apiInstance.post("/mandates/", {
          id: selectedMandateDetails.id as MandateDetails,
          status: selectedMandateDetails.statusToSet as MandateDetails,
        });

        if (res.data.success) {
          fetchMandates();
        }
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

  const handleFilters = (pagination, filters) => {
    if (status.length == 0 && !filters?.status) return;
    let existingStatus = status.sort();
    let newFilteredStatus = filters.status?.sort();
    if (JSON.stringify(existingStatus) === JSON.stringify(newFilteredStatus))
      return;
    setStatus(() => (filters.status ? [...filters.status] : []));
    setCurrentPage(() => 1);
    setLimit(() => 10);
  };

  const handlePagination = {
    total: totalPages * limit,
    defaultCurrent: 1,
    current: currentPage,
    onChange(page, pageSize) {
      setCurrentPage(() => page);
      setLimit(() => pageSize);
    },
  };

  useEffect(() => {
    fetchMandates();
  }, [fetchMandates]);

  return (
    <>
      <div>
        
        <h1>Mandates</h1>
      </div>
      <div className="flex items-start p-4 gap-5 mb-4 mt-8 rounded-3xl border dark:border-[#313638] relative">
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

      <section className="">
        <Table
          className="ant-table-tbody"
          rootClassName={"table_paginator"}
          columns={columns}
          dataSource={data}
          onChange={handleFilters}
          pagination={handlePagination}
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
