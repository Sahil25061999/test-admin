"use client";
import React from "react";
import Image from "next/image";
import { useState } from "react";
import AuraIcon from "../../../public/Aura_Logo_Shine_.png";
import { NAVLINKS } from "../../constants/navbar";
import { NavDropDownItem } from "./NavbarDropDownItem";
import { NavItem } from "./NavItem";
import { LogoutBtn } from "./LogoutBtn";
import { NavbarOpenBtn } from "./NavbarOpenBtn";

// bg-[rgba(49,54,56,0.2)]

export function Navbar() {
  const [displayNav, setNav] = useState(false);
  const displaySidebar = displayNav ? "translate-x-0 bg-white" : "";
  const handleToggleNavbar = () => {
    setNav((prev) => !prev);
  };

  return (
    <>
      <NavbarOpenBtn handleToggleNavbar={handleToggleNavbar} />
      <aside
        id="sidebar-multi-level-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen  transition-transform -translate-x-full md:translate-x-0  ${displaySidebar}`}
        aria-label="Sidebar"
      >
        <div className=" px-3 py-4  dark:bg-gray-800 h-full">
          <div className=" flex items-center justify-between p-2 mb-4">
            <Image alt="aura-icon" src={AuraIcon} height={48} />
            <div className="md:hidden">
              <button onClick={handleToggleNavbar}>close</button>
            </div>
            {/* <h2 className=" font-medium text-[2rem] ms-3 text-stone-500 ">aura</h2> */}
          </div>
          <ul className="space-y-2 font-medium">
            {NAVLINKS.map((item) =>
              item.type === "dropdown" ? (
                <NavDropDownItem key={item.route} item={item} pathname={""} />
              ) : (
                <NavItem key={item.route} item={item} />
              )
            )}
          </ul>
          <LogoutBtn />
        </div>
      </aside>
    </>
  );
}

{
  /* <div className="p-4 sm:ml-64">
<div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
 
</div>
</div> */
}
