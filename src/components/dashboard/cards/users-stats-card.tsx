"use client";
import React from "react";
import { H1 } from "../../h1";

export function UsersStatsCard({ label, stat }) {
  return (
    <div className=" w-full border-l-[5px] border-primary p-6 flex flex-col justify-end items-start text-floral-white rounded-sm bg-stone-100">
      <p className="text-primary w-full opacity-75 ">{label}</p>
      <div className=" mt-1">
        <h1 className=" text-[100px] font-bold ">{stat.toLocaleString("en")}</h1>
      </div>
    </div>
  );
}

// bg-gradient-to-r from-yellow-500 to-yellow-200
