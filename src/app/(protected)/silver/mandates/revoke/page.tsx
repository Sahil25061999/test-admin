"use client";
import { useState } from "react";
import { UpiUserSearch } from "../../../../../components/upiUserSearch";
import { useToast } from "../../../../../context/toast.context";
import { CHRYSUS_API } from "../../../../../config";
import { useAuthAxios } from "../../../../../hooks/useAuthAxios";

export default function Page(){
  const [input,setInput] = useState("")
  const {toast} = useToast()
    const apiInstance = useAuthAxios()
  
  const handleSubmit= async (e)=>{
    e.preventDefault();
    try{
      const res = await apiInstance.post(`admin/v1/mandate/revoke?phone_no=${input}`)
     
    }catch(err){
      toast({
        title:"Error",
        description:err.message ?? "Something went wrong"
      })
    }
  }

  return <div className=" flex justify-center">
    <UpiUserSearch input={input} setInput={setInput} handleSubmit={handleSubmit} placeholder="Enter phone number"/>
  </div>
}