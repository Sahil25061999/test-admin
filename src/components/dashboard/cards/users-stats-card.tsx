"use client";
import React from "react";
import { H1 } from "../../h1";

export function UsersStatsCard({ label, stat }) {
  return (
    <div className=" w-full p-6 flex flex-col justify-end items-start text-floral-white rounded-3xl bg-stone-100">
      <p className=" w-full opacity-75 text-stone-500">{label}</p>
      <div className=" mt-1">
      <H1>{stat}</H1>
      </div>
    </div>
  );
}

// bg-gradient-to-r from-yellow-500 to-yellow-200
