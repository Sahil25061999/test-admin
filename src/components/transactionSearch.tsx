"use client";
import React, { useState } from "react";
import { useFetchList } from "../hooks/useFetchList";

export function TransactionSearch({
  search,
  setSearch,
  setCurrentPage,
  setLimit,
  disableTxnid = false,

}) {
  const [input, setInput] = useState({
    name: "",
    phone: "",
    txnid: "",
  });

  const handleInput = (e) => {
    // console.log(e)
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleReset = () => {
    setInput({
      name:'',
      phone: "",
      txnid: "",
    });
    setSearch({
      name:'',
      phone: "",
      txnid: "",
    });
    setLimit(10);
    setCurrentPage("1");
  };

  const handleSearch = () => {
    setSearch(() => ({ ...input }));
    setLimit(() => 10);
    setCurrentPage("1");
  };
  return (
    <div className="flex flex-col items-start p-4 md:p-8 gap-5 mb-4 mt-4 rounded-2xl border dark:border-[#313638] relative">
      <div className="absolute -top-3 left-6 dark:bg-black px-3">
        <h2 className=" text-lg font-medium">Search</h2>
      </div>
      {Object.entries(input).map(([field, fieldValue]) => {
        return (
          <div
            key={field}
            className={`mt-1 w-full rounded-full py-2 pl-4 pr-2 flex shadow-inner-sm b ${field === 'txnid' && disableTxnid ? 'hidden' : 'flex'}`}
          >
            <input
              id={field}
              name={field}
              placeholder={`Search ${field}`}
              required
              onChange={handleInput}
              type="text"
              value={fieldValue}
              className="border-none placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:ring-0"
            />
            <button
              className=" ml-auto text-sm text-floral-white bg-primary px-4 rounded-full"
              onClick={handleSearch}
            >
              Submit
            </button>
          </div>
        );
      })}
      <button className=" text-primary self-end px-4" onClick={handleReset}>
        Reset
      </button>
    </div>
  );
}
