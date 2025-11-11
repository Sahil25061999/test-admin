"use client";
import { useState } from "react";
import { UpiUserSearch } from "../../../../../components/upiUserSearch";
import { useToast } from "../../../../../context/toast.context";
import { CHRYSUS_API } from "../../../../../config";
import { useAuthAxios } from "../../../../../hooks/useAuthAxios";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const { toast } = useToast();
  const apiInstance = useAuthAxios();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const res = await apiInstance.get(`admin/v1/mandate/revoke?phone=${input}`);

      toast({
        title: "Error",
        description: res?.data?.message,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err.message ?? "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" flex justify-center">
      <UpiUserSearch
        loading={loading}
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        placeholder="Enter phone number"
      />
    </div>
  );
}
