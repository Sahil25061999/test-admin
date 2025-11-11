import React from "react";
import { useToast } from "../context/toast.context";

export function Toast() {
  const { content } = useToast();
  // if(!content.display){
  //   return null
  // }

  return (

    <div
      className={`fixed bottom-4 z-[80] transition-all right-4 backdrop-blur-sm py-2 px-4 shadow rounded-md ${
        content.variant === "neutral" ? "bg-red-700" : "bg-green-700"
      } ${content.display ? " translate-x-0" : " translate-x-20"}`}
    >
      <h3 className=" font-bold">{content.title}</h3>
      <p>{content.description}</p>
    </div>
  );
}
