'use client';
import React from "react";
import { Table as AntTable } from "antd";



export function Table({rowSelection=null, columns, data, ...props }) {
  
  return (
    <AntTable
      {...props}
      rowSelection={rowSelection}
      scroll={{ x: true }}
      className="ant-table-tbody"
      rootClassName={"table_paginator"}
      columns={columns as any}
      dataSource={data}
      // onChange={handleFilters}
      // pagination={handlePagination}
    />
  );
}
