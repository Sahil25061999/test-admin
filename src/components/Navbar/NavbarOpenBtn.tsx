import React from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";

export function NavbarOpenBtn({ handleToggleNavbar }) {
  return (
    <button
      onClick={handleToggleNavbar}
      data-drawer-target="sidebar-multi-level-sidebar"
      data-drawer-toggle="sidebar-multi-level-sidebar"
      aria-controls="sidebar-multi-level-sidebar"
      type="button"
      className="inline-flex items-center p-2 mt-2 ml-3 text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
      aria-label="Open sidebar"
    >
      <span className="sr-only">Open sidebar</span>
      <Bars3Icon className="w-6 h-6" />
    </button>
  );
}