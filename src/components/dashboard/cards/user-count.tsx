"use client";
import React from "react";

export function UserCountCard({userCount}) {

  return (
    <div className=" p-6 flex flex-col justify-end items-start rounded-3xl w-full">
      <p className=" w-full opacity-75 text-blue-200">User</p>
      <h1 className=" w-full text-9xl text-blue-200 font-bold mt-1">
        {userCount}
      </h1>
    </div>
  );
}
