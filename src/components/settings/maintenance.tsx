"use client";

export function Maintenance() {
  function handleMaintenance (e){
    // console.log(e.target.checked)
  }
  return (
    <div className=" p-4 bg-red-600 border rounded-3xl flex items-center justify-between ">
      <p className=" text-red-200">Enable Maintenance</p>
      <div>
        <label className="inline-flex items-centercursor-pointer">
          <input
            onChange={handleMaintenance}
            type="checkbox"
            value=""
            className="sr-only peer"
          />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outlineoutline-none  rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-200"></div>
        </label>
      </div>
    </div>
  );
}
