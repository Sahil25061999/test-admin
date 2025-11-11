"use client";
import React, { useState } from "react";
import { UpiUserSearch } from "../../../components/upiUserSearch";
import { CHRYSUS_API } from "../../../config";
import { Table } from "../../../components/Table";
import { MANDATE_INFO, MANDATE_TXN_INFO } from "../../../constants/transactions.constants";
import { useAuthAxios } from "../../../hooks/useAuthAxios";

export default function Page() {
  const [input, setInput] = useState("");
  const [data, setData] = useState([]);
  const apiInstance = useAuthAxios()

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const res = await apiInstance.get(`admin/v1/mandate/info?phone_number=${input}`);
      setData(res.data.data.mandate_data);
    } catch (e) {}
  };

  return (
    <div>
      <div className="flex justify-center">
        <UpiUserSearch
          placeholder={"Enter mobile number"}
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
        />
      </div>
      <Table data={data} columns={MANDATE_INFO} />
    </div>
  );
}
