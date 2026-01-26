"use client"
import { X } from "lucide-react";
import { useAppContext } from "../../context/app";


export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen, sidebarContent, sidebarTitle } =
    useAppContext()

  return (
    <>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}


      <aside
        className={`fixed top-0 right-0 h-full w-[500px] bg-white shadow-2xl z-50
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="h-full flex flex-col">

          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">{sidebarTitle}</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="
    h-11 w-11
    flex items-center justify-center
    rounded-full
    bg-white cursor-pointer
    text-neutral-900
    border border-neutral-200
    shadow-sm
    hover:bg-neutral-100
    hover:shadow-md
    active:scale-95
    transition-all
  "
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {typeof sidebarContent === "function"
              ? sidebarContent()
              : sidebarContent}
          </div>
        </div>
      </aside>
    </>
  );
}