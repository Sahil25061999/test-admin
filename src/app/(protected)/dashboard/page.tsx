import React from "react";
import {
  TotalTxnStatsCard,
  UsersStatsCard,
} from "../../../components/dashboard/index.dashboard.component";
import Link from "next/link";
import { createAuthenticatedApi } from "../../../lib/api-utils";

export default async function Page() {
  // Server-side data fetching
  let userCount = 0;
  let countOfUsersHavingGold = 0;
  let transactions = {
    total_buy: 0,
    total_autopay: 0,
    total_sell: 0,
    today_buy_txn: 0,
    today_sell_txn: 0,
    today_autopay_txn: 0,
  };

  try {
    const chrysusApi = await createAuthenticatedApi();
    const res = await chrysusApi.get("admin/v1/stats");
    
    if (res && res.data?.success) {
      userCount = res.data.data.user.user_count;
      countOfUsersHavingGold = res.data.data.user.user_w_gold_grt_zero;
      transactions = res.data.data.transaction;
    }
  } catch (error) {
    console.error("Failed to fetch stats:", error?.response);
  }

  return (
    <main className=" w-full">
      <div className=" grid grid-cols-1 lg:grid-cols-12 gap-y-4 lg:gap-4">
        <Link 
          target="_blank" 
          className=" p-4 bg-purple-500 text-white font-medium rounded-full col-span-full" 
          href={"https://auragold.retool.com/auth/login"}
        >
          Go to Retool
        </Link>
        <div className=" md:col-span-6">
          <UsersStatsCard label={"Users"} stat={userCount} />
        </div>
        <div className=" md:col-span-6">
          <UsersStatsCard
            label={"Users havings gold"}
            stat={countOfUsersHavingGold}
          />
        </div>
        <div className=" col-span-1 md:col-span-full mt-4">
          <h1>Transactions</h1>
          <TotalTxnStatsCard transactions={transactions} />
        </div>
      </div>
    </main>
  );
}
