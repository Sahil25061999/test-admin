"use client";
import React, { use, useState } from "react";
import { UpiUserSearch } from "../../../../../components/upiUserSearch";
import { CHRYSUS_API, MOI_API } from "../../../../../config";
import { useToast } from "../../../../../context/toast.context";
import { ArrowDownIcon, Bars2Icon } from "@heroicons/react/24/outline";
import { useAuthAxios } from "../../../../../hooks/useAuthAxios";

interface user {
  _id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  isKycVerified: string;
}
interface UserDetails {
  user: user;
  gold_balance: string;
}

export default function Page() {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [convertLoading, setConvertLoading] = useState(false);
  const [depositLoading, setDepositLoading] = useState(false);
  const [grams, setGrams] = useState("");
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [notes, setNotes] = useState("");
  const [depositFormat, setDepositFormat] = useState("Rupees");
  const { toast } = useToast();
  const apiInstance = useAuthAxios()

  const fetchUserDetails = async (e = null) => {
    e?.preventDefault();
    let token: string;

    if (typeof window !== undefined) {
      token = localStorage.getItem("token");
    }
    try {
      const res = await apiInstance.get(`admin/v1/profile?phone_number=${phone}`);
      // console.log(res);
      if (res && res.data?.success) {
        setUserDetails(res.data.data);
      }
    } catch (e) {
      // console.log(e);
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
    setConvertLoading(true);
    try {
      let block_id = 0;
      const block_id_res = await apiInstance.get("data/v1/prices?product=24KSILVER");
      if (block_id_res && block_id_res.data.success) {
        block_id = block_id_res.data.data.id;
      }
      // console.log(block_id_res);
      const res = await apiInstance.get(
        `data/v1/convert?block_id=${block_id}&price_type=buy&input_val=${amount}&input_type=amt&product_type=SILVER`
      );
      if (res?.data?.success) {
        // console.log(res.data.data);
        setGrams(res?.data?.data?.output_val);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setConvertLoading(false);
    }
  };

  const handleNotes = (e) => {
    setNotes(e.target.value);
  };

  const depositGold = async (e) => {
    e.preventDefault();
    if (!userDetails?.user?.phone_number && !amount) return;
    setDepositLoading(true);
    try {
      let params = {
        amount,
        phone,
        notes
        // code: " ",
        // secret_key: process.env.NEXT_PUBLIC_SECRET_KEY,
        // secret_key:"MEOW",
        // user_id: userDetails.user._id,
      };
      const res = await apiInstance.post("/admin/v1/deposit-silver", params);
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
    } finally {
      setDepositLoading(false);
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
      {/* TODO: CREATE API TO FETCH USER WALLET */}
      <form className=" w-full md:w-1/3 flex flex-col gap-2">
        {/* <div className="flex flex-row items-center justify-between">
          <label className="mr-2">User id</label>
          <input
            className="shadow-inner-sm rounded-md border-none text-gray-400 placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:ring-0"
            type="text"
            disabled
            value={userDetails?.user?._id}
          ></input>
        </div> */}
        <div className="flex items-center justify-between">
          <label className="mr-2">Name</label>
          <input
            className="shadow-inner-sm rounded-md border-none text-gray-400 placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:ring-0"
            type="text"
            disabled
            value={userDetails ? userDetails?.user?.first_name + " " + userDetails?.user?.last_name : ""}
          ></input>
        </div>
        <div className="flex items-center justify-between">
          <label className="mr-2">Phone</label>
          <input
            className="shadow-inner-sm rounded-md border-none text-gray-400 placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:ring-0"
            type="text"
            disabled
            value={userDetails?.user?.phone_number}
          ></input>
        </div>
        <div className="flex items-center justify-between">
          <label className="mr-2">Deposit Format</label>
          <div className=" flex gap-x-4">
            <div className=" flex items-center gap-x-1">
              <label htmlFor="deposit-grams">Grams</label>
              <input
                onChange={() => setDepositFormat("Grams")}
                checked={depositFormat === "Grams"}
                name="deposit_format"
                id="deposit-grams"
                className="shadow-inner-sm rounded-md border-none text-gray-400 placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:ring-0"
                type="radio"
                value={"Grams"}
              ></input>
            </div>
            <div className=" flex items-center gap-x-1">
              <label htmlFor="deposit-rupees">Rupees</label>
              <input
                onChange={() => setDepositFormat("Rupees")}
                checked={depositFormat === "Rupees"}
                name="deposit_format"
                id="deposit-rupees"
                className="shadow-inner-sm rounded-md border-none text-gray-400 placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:ring-0"
                type="radio"
                value={"Rupees"}
              ></input>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="mr-2">Deposit Silver(in rupees)</label>
            <input
              className="shadow-inner-sm rounded-md placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:ring-0"
              type="text"
              value={amount}
              placeholder="Enter amount"
              onChange={handleAmount}
            ></input>
          </div>
          <button className=" bg-primary text-sm text-white py-4 px-6 rounded-full ml-auto flex" onClick={getInGram}>
            <span className="">
              {" "}
              <ArrowDownIcon height={20} />
            </span>
            {convertLoading ? "Loading..." : "Convert"}
          </button>
        </div>
        <div className="flex items-center justify-between">
          <label className="mr-2">Silver(in grams)</label>
          <input
            className="shadow-inner-sm rounded-md border-none text-gray-400 placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:ring-0"
            disabled
            type="text"
            value={grams}
          ></input>
        </div>
        <div className="flex items-center justify-between">
          <label className="mr-2">Notes</label>
          <textarea
            className="shadow-inner-sm rounded-md border-none text-gray-400 placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:ring-0"
            onChange={handleNotes}
            value={notes}
          ></textarea>
        </div>
        <button
          onClick={depositGold}
          className="flex mx-auto mt-4 bg-[#f5f749] text-sm py-4 px-6 rounded-full text-black"
        >
          {depositLoading ? "loading..." : "Deposit silver"}
        </button>
      </form>
    </div>
  );
}
