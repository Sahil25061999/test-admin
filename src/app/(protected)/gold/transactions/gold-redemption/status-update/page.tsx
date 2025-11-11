"use client";
import { Select } from "antd";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { CHRYSUS_API } from "../../../../../../config";
import { useToast } from "../../../../../../context/toast.context";
import { Dialog, Transition } from "@headlessui/react";
import { Modal } from "../../../../../../components/Modal/Modal";
import { Table } from "../../../../../../components/Table";
import { GOLD_REDEMPTION_TXN_COLUMNS } from "../../../../../../constants/transactions.constants";
import { StatusUpdateBulk } from "../../../../../../components/StatusUpdateBulk";
import GoldRedemptionBulkUpdate from '../../../../../../components/gold-redemption-bulk'

export default function Page() {
  return (
    <GoldRedemptionBulkUpdate/>
  );
}
