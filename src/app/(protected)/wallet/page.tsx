"use client";
import React, { useState } from "react";
import { UpiUserSearch } from "../../../components/upiUserSearch";
import { useToast } from "../../../context/toast.context";
import { clientApi } from "../../../lib/client-api";

interface user {
  _id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  isKycVerified: string;
}
interface UserDetails {
  user: user;
}

export default function Page() {
  const [phone, setPhone] = useState("");
  const [qtyG, setQtyG] = useState("");
  const [productName, setProductName] = useState<"SILVER24" | "GOLD24">("GOLD24");
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const { toast } = useToast();

  const fetchUserDetails = async (e = null) => {
    e?.preventDefault();
    try {
      const res = await fetch(`/api/user/${phone}?type=profile`);
      const data = await res.json();
      if (data?.success) {
        setUserDetails(data.data);
      } else {
        toast({
          title: "Error",
          description: data?.message || "User not found",
        });
        setUserDetails(null);
      }
    } catch (e) {
      toast({
        title: "Error",
        description: "Something went wrong",
      });
      setUserDetails(null);
    }
  };

  const handleQtyG = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQtyG(e.target.value);
  };

  const handleProductName = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProductName(e.target.value as "SILVER24" | "GOLD24");
  };

  const updateWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userDetails?.user?.phone_number || !qtyG) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
      });
      return;
    }

    const qty = parseFloat(qtyG);
    if (isNaN(qty)) {
      toast({
        title: "Error",
        description: "Quantity must be a positive number",
      });
      return;
    }

    setLoading(true);
    try {
      const data = await clientApi.updateWallet({
        phone_number: userDetails.user.phone_number,
        qty_g: qty,
        product_name: productName,
      });

      if (data?.success) {
        toast({
          title: "Success",
          description: data?.message || "Wallet updated successfully",
          variant: "success",
        });
        // Reset form
        setQtyG("");
      } else {
        toast({
          title: "Error",
          description: data?.message || "Failed to update wallet",
        });
      }
    } catch (e) {
      toast({
        title: "Error",
        description: "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <UpiUserSearch
        input={phone}
        setInput={setPhone}
        handleSubmit={fetchUserDetails}
        placeholder={"Enter phone number"}
      />
      <form className="w-full md:w-1/3 flex flex-col gap-2" onSubmit={updateWallet}>
        <div className="flex items-center justify-between">
          <label className="mr-2">Name</label>
          <input
            className="shadow-inner-sm rounded-md border-none text-gray-400 placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:ring-0"
            type="text"
            disabled
            value={userDetails ? userDetails?.user?.first_name + " " + userDetails?.user?.last_name : ""}
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="mr-2">Phone</label>
          <input
            className="shadow-inner-sm rounded-md border-none text-gray-400 placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:ring-0"
            type="text"
            disabled
            value={userDetails?.user?.phone_number || ""}
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="mr-2">Product Name</label>
          <select
            className="shadow-inner-sm rounded-md border-none text-gray-950 placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:ring-0 px-3 py-2"
            value={productName}
            onChange={handleProductName}
          >
            <option value="GOLD24">GOLD24</option>
            <option value="SILVER24">SILVER24</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <label className="mr-2">Quantity (grams)</label>
          <input
            className="shadow-inner-sm rounded-md placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:ring-0 px-3 py-2"
            type="number"
            // step="0.01"
            // min="0"
            value={qtyG}
            placeholder="Enter quantity in grams"
            onChange={handleQtyG}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading || !userDetails}
          className="flex mx-auto mt-4 bg-[#f5f749] text-sm py-4 px-6 rounded-full text-black disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Loading..." : "Update Wallet"}
        </button>
      </form>
    </div>
  );
}
