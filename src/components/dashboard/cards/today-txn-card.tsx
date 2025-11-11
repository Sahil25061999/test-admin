import { CreditCardIcon } from "@heroicons/react/24/outline";
import React from "react";

export function TodayTxnCard(props) {
  return (
    <div className=" w-full p-4 flex flex-col  text-floral-white rounded-3xl bg-stone-100">
      <div className=" w-full flex items-center">
        <props.icon height={18} color="rgb(120,113,108)" />
        <p className=" w-full opacity-75 text-stone-500 font-medium">{props.label}</p>
      </div>
      <h1 className=" w-full text-3xl font-bold mt-1">{props.value}</h1>
    </div>
  );
}
