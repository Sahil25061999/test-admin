import React from 'react'

export default function Page() {
  return (
    <div className=' flex h-[95vh] gap-2 overflow-hidden text-3xl rounded-3xl font-semibold cursor-pointer'>
      <div className="flex flex-1 bg-yellow-500 text-yellow-200 justify-center items-center">
        <p>
        gold
        </p>
      </div>
      <div className="flex flex-1 bg-gray-400 text-gray-200 justify-center items-center"><p>silver</p></div>
    </div>
  )
}
