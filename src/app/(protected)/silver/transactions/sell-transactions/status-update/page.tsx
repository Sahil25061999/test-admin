"use client";
import { Select } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import { CHRYSUS_API } from "../../../../../../config";
import { useToast } from "../../../../../../context/toast.context";
import { Dialog, Transition } from "@headlessui/react";
import { StatusUpdateBulk } from "../../../../../../components/StatusUpdateBulk";
import { SELL_TXN_COLUMNS } from "../../../../../../constants/transactions.constants";

async function timeout() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("");
    }, 2000);
  });
}

export default function Page() {

  return (
    <div className="relative">
      <StatusUpdateBulk
        cancelUrl={"admin/v1/sell-txn/cancel"}
        successUrl={"transaction/v1/execute/txns"}
        columnFormat={SELL_TXN_COLUMNS}
      />
    </div>
  );
}
