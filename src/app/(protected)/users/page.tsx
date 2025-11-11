"use client";

import React, { useState, Fragment, useEffect, useCallback } from "react";
import { Table } from "antd";
import { USER_COLUMNS as columns } from "../../../constants/index.constants";
import { CHRYSUS_API } from "../../../config";
import { useToast } from "../../../context/toast.context";
import { useAuthAxios } from "../../../hooks/useAuthAxios";

interface MandateDetails {
  id?: string;
  statusToSet?: string;
}

export default function Page() {
  const [data, setData] = useState([]);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [status, setStatus] = useState([]);
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

  const fetchUsers = useCallback(async () => {
    let token: string;
    if (typeof window !== undefined) {
      token = localStorage.getItem("token");
    }
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
      const params = {
        name: search.name,
        phone: search.phone,
        txnid: search.txnid,
        page: currentPage.toString(),
        limit: limit.toString(),
        status: status.join(","),
        startdate: date.startDate,
        enddate: date.endDate,
      };
      
      const searchParams = new URLSearchParams(params);
      const res = await fetch(`/api/users?${searchParams.toString()}`);
      const data = await res.json();

      if (data?.success) {
        setData(() => {
          return data.data;
        });
      }
    } catch (e) {
      // console.log(e);
      if (e?.response?.data?.message) {
        toast({
          title: "Error",
          description: e?.response?.data?.message,
        });
      } else {
        toast({
          title: "Error",
          description: "Something went wrong",
        });
      }
    }
  }, [currentPage, limit, date.startDate, date.endDate, status, search.phone, search.txnid, search.name]);

  const handleFilters = (pagination, filters) => {
    if (status.length == 0 && !filters?.status) return;
    let existingStatus = status.sort();
    let newFilteredStatus = filters.status?.sort();
    if (JSON.stringify(existingStatus) === JSON.stringify(newFilteredStatus)) return;
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
    fetchUsers();
  }, [fetchUsers]);

  return (
    <>
      <div>
        <h1>Users</h1>
      </div>
      {/* <div className="flex items-start p-4 gap-5 mb-4 mt-8 rounded-3xl border dark:border-[#313638] relative">
        <div className="absolute -top-3 left-6 dark:bg-black px-3">
          <h2 className=" text-lg font-medium">Filters</h2>
        </div>
        <TransactionSearch
          search={search}
          setSearch={setSearch}
          setLimit={setLimit}
          setCurrentPage={setCurrentPage}
          disableTxnid ={true}
        />
      </div> */}

      <section className="">
        <Table
          scroll={{ x: true }}
          className="ant-table-tbody whitespace-pre"
          rootClassName={"table_paginator"}
          columns={columns}
          dataSource={data}
          onChange={handleFilters}
          pagination={handlePagination}
        />
      </section>
    </>
  );
}
