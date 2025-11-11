"use client";
import React, { useState } from "react";

export function DateFilter({ date, setDate }) {
  const [checked, setChecked] = useState(true);

  const handleReset = () => {
    setChecked(() => true);
    setDate((prev) => {
      for (let key of Object.keys(prev)) {
        prev[key] = "";
      }
      return { ...prev };
    });
  };

  return (
    <div className="flex flex-col items-start px-8 py-4 gap-5 mb-4 mt-4 rounded-2xl border dark:border-[#313638] relative">
      <div className="absolute -top-3 left-6 dark:bg-black px-3">
        <h2 className=" text-lg font-medium">Date</h2>
      </div>
      <div className=" h-full">
        <label className=" text-xs">Start Date</label>
        <input
          className="text-floral-white shadow-inner block"
          value={date.startDate}
          onChange={(e) =>{
           
            setDate((prev) => ({
              ...prev,
              startDate: e.target.value,
              endDate: checked ? e.target.value : prev.endDate,
            }))}
          }
          type="date"
        />
      </div>
      <div>
        <label className=" text-xs">End Date</label>
        <input
          className="text-floral-white shadow-inner block"
          value={date.endDate}
          onChange={(e) => {
            setChecked(() => false);
            setDate((prev) => ({ ...prev, endDate: e.target.value }));
          }}
          type="date"
        />
        <div className="mt-2">
          <input
            checked={checked}
            onChange={(e) => {
              setChecked((prev) => !prev);
              if (e.target.checked) {
                setDate((prev) => ({ ...prev, endDate: prev.startDate }));
              }
            }}
            id="asStart"
            type="checkbox"
          />
          <label className="ml-2 text-sm" htmlFor="asStart">
            same as start date
          </label>
        </div>
      </div>
      <div className="text-primary px-2 self-end ">
        <button onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
}
