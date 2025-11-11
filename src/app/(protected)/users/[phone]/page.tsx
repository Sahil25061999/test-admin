"use client";

import { Table } from "antd";
import React, { useEffect, useState } from "react";
import { CHRYSUS_API } from "../../../../config";
import { useAuthAxios } from "../../../../hooks/useAuthAxios";
// import

export default function Page({ params: { phone } }) {
  const [userDetails, setUserDetails] = useState<any>();
  const [walletDetails, setWalletDetails] = useState<any>();
  const [data, setData] = useState([]);
  const [goldRedemptionData, setGoldRedemptionData] = useState([]);
  const apiInstance = useAuthAxios()

  const fetchProfile = async () => {
    try {
      const res = await apiInstance.get(
        `admin/v1/profile?phone_number=${phone}`
      );
      if (res && res.data.success) {
        setUserDetails(res.data.data.user);
      }
    } catch (e) {}
  };

  const fetchWallet = async () => {
    try {
      const res = await apiInstance.get(
        `admin/v1/wallet?phone_number=${phone}`
      );
      // console.log(res);
      if (res && res.data.success) {
        setWalletDetails(res.data.data);
      }
    } catch (e) {}
  };

  const fetchUserBuyTxn = async () => {
    try {
      const res = await apiInstance.get(
        `admin/v1/buy-metal/txn-info?phone_number=${phone}&txn_type=BUY&product_name=GOLD24`
      );
      // console.log(res)
      if (res && res.data.success) {
        // console.log(res.data)
        setData(res.data.data.transactions);
      }
    } catch (e) {}
  };
  const fetchUserGoldRedemptionTxn = async () => {
    try {
      const res = await apiInstance.get(
        `admin/v1/redeem-gold/txn-info?phone_number=${phone}&txn_type=BUY`
      );
      // console.log(res);
      if (res && res.data.success) {
        // console.log(res.data);
        setGoldRedemptionData(res.data.data.transactions);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchProfile();
    fetchWallet();
    fetchUserBuyTxn();
    fetchUserGoldRedemptionTxn();
  }, []);
  // console.log(userDetails);
  return (
    <div>
      <div className=" flex items-start mb-8 gap-10">
        <div className="">
          <h3>User</h3>
          {userDetails ? (
            <>
              <div className="flex items-center gap-1">
                <h1>
                  {userDetails.first_name + " " + (userDetails.last_name || "")}
                </h1>
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="#8ed081"
                    className="w-8 h-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                    />
                  </svg>
                </span>
              </div>
              <p>{userDetails.phone_number}</p>
              <p>{userDetails.email}</p>
            </>
          ) : null}
        </div>
        <div>
          <p>Gold bought</p>
          <h1 className=" text-yellow-800">{walletDetails?.wallet_details.gold_quantity || 0}gm</h1>
        </div>
      </div>
      <div className=" flex flex-col gap-8 xl:flex-row">
        {data && (
          <section className="w-full overflow-x-auto  ">
            <div className="mb-4">Buys</div>
            <Table
             scroll={{ x: true }}
              columns={[
                {
                  key: "Transaction Id",
                  dataIndex: "external_txn_id",
                  title: "Transaction Id",
                },
                {
                  key: "Quantity",
                  dataIndex: "qty_g",
                  title: "Quantity",
                },
                {
                  key: "GST",
                  dataIndex: "gst_rs",
                  title: "GST",
                },
                {
                  key: "Amount",
                  dataIndex: "total_value_rs",
                  title: "Amount",
                },
                {
                  key: "Status",
                  dataIndex: "txn_status",
                  title: "Status",
                },
                {
                  key: "Rate",
                  dataIndex: "rate_per_g_wo_gst",
                  title: "Rate(excl. GST)",
                },
                {
                  key: "Coupon Applied",
                  dataIndex: "attached_coupon_code",
                  title: "Coupon Applied",
                },
              ]}
              dataSource={data}
              // onChange={handleFilters}
              // pagination={handlePagination}
            />
          </section>
        )}
        {goldRedemptionData && goldRedemptionData.length > 0 && (
          <section className="w-full overflow-x-auto ">
            <div className="mb-4">Gold Redemption</div>
            <Table
            scroll={{x:true}}
              className="ant-table-tbody whitespace-pre"
              rootClassName={"table_paginator"}
              columns={[
                {
                  key: "Transaction Id",
                  dataIndex: "transaction",
                  title: "Transaction Id",
                  render: (item) => item.txn_id,
                },
                {
                  key: "Gold purchased",
                  dataIndex: "transaction",
                  title: "Gold purchased",
                  render: (item) => item.gold_quantity_purchased,
                },
                {
                  key: "Gold redeemed",
                  dataIndex: "transaction",
                  title: "Gold redeemed",
                  render: (item) => item.gold_redeemed_from_vault,
                },
                {
                  key: "Amount",
                  dataIndex: "transaction",
                  title: "Amount",
                  render: (item) => item.total_price,
                },
                {
                  key: "Status",
                  dataIndex: "transaction",
                  title: "Status",
                  render: (item) => item.txn_status,
                },
                {
                  key: "Rate",
                  dataIndex: "transaction",
                  title: "Rate(excl. GST)",
                  render: (item) => item.rate_per_g_wo_gst,
                },
                // {
                //   key:"Coupon Applied",
                //   dataIndex:'attached_coupon_code',
                //   title:"Coupon Applied"
                // },
              ]}
              dataSource={goldRedemptionData}
              // onChange={handleFilters}
              // pagination={handlePagination}
            />
          </section>
        )}
      </div>
    </div>
  );
}
