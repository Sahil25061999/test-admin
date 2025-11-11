import React from "react";

export function MandateTransaction({label, value}) {
  return (
      <div className=" py-4">
        <div className=" h-72 w-80 bg-gradient-to-br from-green-500 from-10% to-transparent to-90% p-4 rounded-2xl">
          <div className="h-full">
            <div className="flex justify-between mt-auto">
              <p>{label}</p>
              <h2 className="">{value}</h2>
            </div>
          </div>
        </div>
      </div>
  );
}
