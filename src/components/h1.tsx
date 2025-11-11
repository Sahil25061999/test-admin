import React from "react";

export function H1({ children, classname }:any) {
  return <h1 className={` w-full text-6xl lg:text-9xl font-bold ${classname}`}>{children}</h1>;
}
