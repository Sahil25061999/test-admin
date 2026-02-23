'use client'

import React, { useState, useEffect } from "react";
import {
  TotalTxnStatsCard,
  UsersStatsCard,
} from "../../../components/dashboard/index.dashboard.component";
import { PageHeader } from "../../../components/dashboard/PageHeader";

export default function Page() {
  const [stats, setStats] = useState({
    user_count: 0,
    user_w_gold_grt_zero: 0,
    user_w_silver_grt_zero: 0,
    user_w_both_gold_silver: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stats");
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const result = await res.json();
      if (result?.success && result?.data) {
        setStats(result.data);
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err);
      setError("Failed to load statistics. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <div className="p-4">Loading dashboard...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <main className="w-full">
      <PageHeader
        title="Dashboard"
        subtitle="Overview of key metrics and activity"
      />

      <div className="grid grid-cols-1 py-4 lg:grid-cols-12 gap-y-4 lg:gap-4">
        <div className="md:col-span-6">
          <UsersStatsCard label="Users" stat={stats.user_count} />
        </div>
        <div className="md:col-span-6">
          <UsersStatsCard
            label="Users having gold"
            stat={stats.user_w_gold_grt_zero}
          />
        </div>
        <div className="md:col-span-6">
          <UsersStatsCard
            label="Users having silver"
            stat={stats.user_w_silver_grt_zero}
          />
        </div>
        <div className="md:col-span-6">
          <UsersStatsCard
            label="Users having both gold and silver"
            stat={stats.user_w_both_gold_silver}
          />
        </div>
      </div>
    </main>
  );
}
