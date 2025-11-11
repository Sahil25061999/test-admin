"use client";
import React, { useState } from "react";
import { UpiUserSearch } from "../../../components/upiUserSearch";
import { MOI_API } from "../../../config";
import { useToast } from "../../../context/toast.context";

interface user {
  _id: string;
  name: string;
  phone: string;
  isKycVerified: string;
}
interface UserDetails {
  user: user;
  gold_balance: string;
}

export default function Page() {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [grams, setGrams] = useState("");
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const { toast } = useToast();

  const fetchUserDetails = async (e = null) => {
    e?.preventDefault();
    let token: string;

    if (typeof window !== undefined) {
      token = localStorage.getItem("token");
    }
    try {
      const res = await MOI_API.get(`admin/user?phone=${phone}`, {
        headers: { Authorization: token },
      });
      console.log(res);
      if (res && res.data?.success) {
        setUserDetails(res.data.data);
      }
    } catch (e) {
      console.log(e);
      if (e?.response?.data?.message) {
        toast({
          title: "Error",
          description: e.response.data.message,
        });
      } else {
        toast({
          title: "Error",
          description: "Something went wrong",
        });
      }
    }
  };

  const handleAmount = (e) => {
    setAmount(() => e.target.value);
  };

  const getInGram = async (e) => {
    e.preventDefault();
    let token: string;

    if (typeof window !== undefined) {
      token = localStorage.getItem("token");
    }
    try {
      const res = await MOI_API.get(`admin/convert-price?amount=${amount}`, {
        headers: { Authorization: token },
      });
      if (res?.data?.success) {
        setGrams(res?.data?.data?.quantity);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const depositGold = async (e) => {
    e.preventDefault();
    if (!userDetails || !userDetails?.user._id) return;
    let token: string;
    if (typeof window !== undefined) {
      token = localStorage.getItem("token");
    }
    try {
      let params = {
        amount,
        code: " ",
        secret_key: process.env.NEXT_PUBLIC_SECRET_KEY,
        // secret_key:"MEOW",
        user_id: userDetails.user._id,
      };
      const res = await MOI_API.post("/payment/deposit_gold", params, {
        headers: { Authorization: token },
      });
      if (res?.data?.success) {
        fetchUserDetails();
        toast({
          title: "Success",
          description: res?.data?.message,
          variant: "success",
        });
      }
    } catch (e) {
      if (e?.response?.message) {
        toast({
          title: "Error",
          description: e.reponse.message,
        });
      } else {
        toast({
          title: "Error",
          description: "Something went wrong",
        });
      }
    }
  };

  return (
    <div>
      <UpiUserSearch
        input={phone}
        setInput={setPhone}
        handleSubmit={fetchUserDetails}
        placeholder={"Enter phone number"}
      />
      {/* TODO: CREATE API TO FETCH USER WALLET */}
      <form>
        <div className="flex items-center justify-center">
          <label className="mr-2">User id</label>
          <input type="text" disabled value={userDetails?.user?._id}></input>
        </div>
        <div className="flex items-center justify-center">
          <label className="mr-2">Name</label>
          <input type="text" disabled value={userDetails?.user?.name}></input>
        </div>
        <div className="flex items-center justify-center">
          <label className="mr-2">Phone</label>
          <input type="text" disabled value={userDetails?.user?.phone}></input>
        </div>
        <div className="flex items-center justify-center">
          <label className="mr-2">Kyc verified</label>
          <input
            type="text"
            disabled
            value={userDetails?.user?.isKycVerified}
          ></input>
        </div>
        <div className="flex items-center justify-center">
          <label className="mr-2">Wallet</label>
          <input type="text" disabled value={userDetails?.gold_balance}></input>
        </div>
        <div className="flex items-center justify-center">
          <label className="mr-2">Deposit Gold(in rupees)</label>
          <input type="text" value={amount} onChange={handleAmount}></input>
          <button
            className=" bg-primary text-sm py-4 px-6 rounded-full "
            onClick={getInGram}
          >
            Convert
          </button>
        </div>
        <div className="flex items-center justify-center">
          <label className="mr-2">Deposit Gold(in grams)</label>
          <input disabled type="text" value={grams}></input>
        </div>
        <button
          onClick={depositGold}
          className="flex mx-auto mt-4 bg-[#f5f749] text-sm py-4 px-6 rounded-full text-black"
        >
          Deposit gold
        </button>
      </form>
    </div>
  );
}
