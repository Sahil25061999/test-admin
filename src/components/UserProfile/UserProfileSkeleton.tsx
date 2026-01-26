import React from "react";

const UserProfileSkeleton = () => {
  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 rounded-xl border bg-white animate-pulse"
          >

            <div className="h-12 w-12 rounded-full bg-gray-200" />

            <div className="flex-1 space-y-2">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-6 w-32 bg-gray-300 rounded" />
            </div>

            {i === 1 && (
              <div className="h-6 w-16 bg-gray-200 rounded-full" />
            )}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border bg-white p-6 animate-pulse">

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gray-200" />
            <div className="h-5 w-40 bg-gray-300 rounded" />
          </div>

          <div className="flex items-center gap-3">
            <div className="h-5 w-5 bg-gray-200 rounded" />
            <div className="h-5 w-5 bg-gray-200 rounded" />
          </div>
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
            >
              <div className="h-4 w-28 bg-gray-200 rounded" />
              <div className="h-4 w-40 bg-gray-300 rounded" />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default UserProfileSkeleton;
