"use client";
import React, { useEffect, useState } from "react";
import { OfferModal, VoucherModal } from "../../../../components/index.component";
import { Table } from "antd";
import { CHRYSUS_API } from "../../../../config";
import { useAuthAxios } from "../../../../hooks/useAuthAxios";

export default function Page() {
  const [displayOfferModal, setDisplayOfferModal] = useState(false);
  const [displayVoucherModal, setDisplayVoucherModal] = useState(false);
  const [allOffers, setAllOffers] = useState([]);
  const [allVouchers, setAllVouchers] = useState([]);
  const apiInstance = useAuthAxios()

  const toggleOfferModal = () => setDisplayOfferModal((prev) => !prev);
  const toggleVoucherModal = () => setDisplayVoucherModal((prev) => !prev);

  const fetchAllOffers = async () => {
    try {
      const res = await apiInstance.get("discount/v1/all");
      if (res.data && res.data.success) {
        setAllOffers(() => res.data.data.discount_codes);
      }
    } catch (e) {}
  };
  const fetchAllVouchers = async () => {
    try {
      const res = await apiInstance.get("discount/v1/voucher/all");
      if (res.data && res.data.success) {
        // console.log(res.data.data.voucher_codes);
        setAllVouchers(() => res.data.data.voucher_codes);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchAllOffers();
    fetchAllVouchers();
  }, []);

  return (
    <div>
      <div className="md:flex md:items-center gap-4">
        <button
          onClick={toggleOfferModal}
          data-modal-target="crud-modal"
          data-modal-toggle="crud-modal"
          className="block text-white bg-primary focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          type="button"
        >
          Create Offers
        </button>
        <button
          onClick={toggleVoucherModal}
          data-modal-target="crud-modal"
          data-modal-toggle="crud-modal"
          className="block text-white bg-primary focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          type="button"
        >
          Create Vouchers
        </button>
        <OfferModal display={displayOfferModal} toggleModal={toggleOfferModal} fetchAllOffers={fetchAllOffers} />
        <VoucherModal
          display={displayVoucherModal}
          toggleModal={toggleVoucherModal}
          fetchAllVouchers={fetchAllVouchers}
        />
      </div>
      <div className="flex flex-col gap-8 mt-4">
        <section className="w-full relative overflow-x-auto">
          <div className="mb-4">Offers</div>
          <Table
            scroll={{ x: true }}
            className="ant-table-tbody whitespace-pre"
            rootClassName={"table_paginator"}
            columns={[
              {
                key: "Code",
                dataIndex: "code",
                title: "Code",
                // render: (item) => item.txn_id,
              },
              {
                key: "Value",
                dataIndex: "value",
                title: "Value",
                // render: (item) => item.gold_quantity_purchased,
              },
              {
                key: "Minimum Value",
                dataIndex: "minimum_value",
                title: "Minimum Value",
                // render: (item) => item.gold_redeemed_from_vault,
              },
              {
                key: "Maximum Value",
                dataIndex: "maximum_value",
                title: "Maximum Value",
                // render: (item) => item.gold_redeemed_from_vault,
              },
              {
                key: "Expiry Date",
                dataIndex: "expiry_date",
                title: "Expiry Date",
                // render: (item) => item.total_price,
              },
              {
                key: "Description",
                dataIndex: "description",
                title: "Description",
                // render: (item) => item.txn_status,
              },
              // {
              //   key: "Rate",
              //   dataIndex: "transaction",
              //   title: "Rate(excl. GST)",
              //   render: (item) => item.rate_per_g_wo_gst,
              // },
              // {
              //   key:"Coupon Applied",
              //   dataIndex:'attached_coupon_code',
              //   title:"Coupon Applied"
              // },
            ]}
            dataSource={allOffers}
            // onChange={handleFilters}
            // pagination={handlePagination}
          />
        </section>
        <section className="w-full  ">
          <div className="mb-4">Vouchers</div>
          <Table
            scroll={{ x: true }}
            className="ant-table-tbody whitespace-pre"
            rootClassName={"table_paginator"}
            columns={[
              {
                key: "Code",
                dataIndex: "code",
                title: "Code",
                // render: (item) => item.txn_id,
              },
              {
                key: "Gold Quantity",
                dataIndex: "gold_qty",
                title: "Gold Quantity",
                // render: (item) => item.gold_quantity_purchased,
              },
              {
                key: "Redeemed",
                dataIndex: "is_used",
                title: "Redeemed",
                render: (item) => (item ? "is used" : "not used"),
              },
            ]}
            dataSource={allVouchers}
            // onChange={handleFilters}
            // pagination={handlePagination}
          />
        </section>
      </div>
    </div>
  );
}
