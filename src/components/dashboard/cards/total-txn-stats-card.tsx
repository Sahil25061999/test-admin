"use client";
import React from "react";
import {
  ChartPieIcon,
  CurrencyRupeeIcon,
  TagIcon,
  HashtagIcon,
  PowerIcon,
  BuildingLibraryIcon,
  CircleStackIcon,
  ArrowPathRoundedSquareIcon,
  CreditCardIcon,
  NoSymbolIcon,
  UsersIcon,
  WrenchIcon,
} from "@heroicons/react/24/outline";
import { DonutChart, EventProps } from "@tremor/react";
import { TodayTxnCard } from "./today-txn-card";
import { H1 } from "../../h1";

const sales = [
  {
    name: "New York",
    sales: 980,
  },
  {
    name: "London",
    sales: 456,
  },
  {
    name: "Hong Kong",
    sales: 390,
  },
  {
    name: "San Francisco",
    sales: 240,
  },
  {
    name: "Singapore",
    sales: 190,
  },
];

const valueFormatter = (number: number) => `${Intl.NumberFormat("us").format(number).toString()}`;

export function TotalTxnStatsCard({ transactions }) {
  const [value, setValue] = React.useState<EventProps>(null);
  const data = [
    {
      name: "Buy",
      value: transactions.total_buy,
    },
    {
      name: "Sell",
      value: transactions.total_sell,
    },
    {
      name: "Autopay",
      value: transactions.total_autopay,
    },
  ];
  function formatNumber(number) {
    if (number >= 10000000) {
      return (number / 10000000).toFixed(2) + "CR";
    } else if (number >= 100000) {
      return (number / 100000).toFixed(2) + "L";
    } else if (number >= 1000) {
      return (number / 1000).toFixed(2) + "K";
    } else {
      return number.toString();
    }
  }
  const sum = data && formatNumber(data.reduce((acc, curr) => acc + curr.value, 0));

  return (
    <div className=" w-full p-2 lg:flex justify-between items-center text-floral-white rounded-3xl bg-stone-100">
      <div className=" w-full flex  justify-between items-center p-4">
        <div>
          <p className=" w-full opacity-75 text-stone-500">Total Transactions</p>
          <div className=" mt-1">
            <H1>{sum}</H1>
          </div>
        </div>
        <div className="w-full hidden lg:block">
          <DonutChart
            showLabel={false}
            data={data}
            index="name"
            valueFormatter={valueFormatter}
            colors={["stone-900", "stone-50", "stone-600"]}
            onValueChange={(v) => setValue(v)}
          />
        </div>
      </div>
      <div className=" w-full md:flex justify-between items-center gap-6 bg-stone-900 text-stone-100 rounded-3xl p-4">
        <div>
          <p className=" w-full opacity-75 text-stone-50">{"Today's Transactions"}</p>
          <div className=" mt-1">
          <H1 className=" w-full text-9xl font-bold">
            {transactions.today_buy_txn + transactions.today_sell_txn + transactions.today_sell_txn}
          </H1>
          </div>
        </div>
        <div className="w-full text-stone-900 flex gap-2 mt-auto mb-6">
          <TodayTxnCard icon={CreditCardIcon} label={"buy"} value={transactions.today_buy_txn} />
          <TodayTxnCard icon={TagIcon} label={"sell"} value={transactions.today_sell_txn} />
          <TodayTxnCard icon={ArrowPathRoundedSquareIcon} label={"autopay"} value={transactions.today_autopay_txn} />
        </div>
      </div>
    </div>
  );
}

// bg-gradient-to-r from-yellow-500 to-yellow-200
