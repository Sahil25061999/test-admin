"use client";
import { Select } from "antd";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { CHRYSUS_API } from "../config";
import { useToast } from "../context/toast.context";
import { Dialog, Transition } from "@headlessui/react";
import { Modal } from "../components/Modal/Modal";
import { Table } from "../components/Table";
import { GOLD_REDEMPTION_TXN_COLUMNS } from "../constants/transactions.constants";
import { StatusUpdateBulk } from "../components/StatusUpdateBulk";

async function timeout() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("");
    }, 2000);
  });
}

export default function Page() {
  return (
    <div className=" relative">
      <StatusUpdateBulk
        columnFormat={GOLD_REDEMPTION_TXN_COLUMNS}
        cancelUrl={"admin/v1/redeem-txn/cancel"}
        successUrl={"redemption/v1/execute/txns?product_name=GOLD24"}
      />
    </div>
  );
}
