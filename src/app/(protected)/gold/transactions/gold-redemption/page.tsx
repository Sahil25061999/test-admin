"use client";

import { useState, Fragment, useMemo } from "react";
import axios from "axios";
import { Dialog, Transition } from "@headlessui/react";
import { useFetchList } from "../../../../../hooks/useFetchList";
import { GOLD_REDEMPTION_TXN_COLUMNS as columns } from "../../../../../constants/index.constants";
import { DateFilter, TransactionSearch } from "../../../../../components/index.component";
import { useRouter } from "next/navigation";
import { CHRYSUS_API, MOI_API } from "../../../../../config";
import { useToast } from "../../../../../context/toast.context";
import { ArrowDownIcon, ArrowDownLeftIcon, Bars2Icon, PencilIcon } from "@heroicons/react/24/outline";
import { useTable } from "../../../../../hooks/useTable";
import { Table } from "../../../../../components/Table";
import { Modal } from "../../../../../components/Modal/Modal";
import { useBulkTxn } from "../../../../../context/bulkTxn.context";
import GoldRedemption from "../../../../../components/gold-redemption";
export default function Page() {
  return (
    <>
      <GoldRedemption />
    </>
  );
}
