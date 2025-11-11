"use client";
import { Select } from "antd";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import SilverRedemptionBulk from "../../../../components/silver-redemption-bulk";

async function timeout() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("");
    }, 2000);
  });
}

export default function Page() {
  return (
    <SilverRedemptionBulk/>
  );
}
