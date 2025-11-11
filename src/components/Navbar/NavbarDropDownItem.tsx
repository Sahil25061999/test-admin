"use client";
import { useState } from "react";
import { NavItem } from "./NavItem";

export function NavDropDownItem({ item, pathname }) {
  const [display, setDisplay] = useState(false);

  const handleDropdown = () => setDisplay((prev) => !prev);

  return (
    <li>
      <button
        onClick={handleDropdown}
        type="button"
        className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
        aria-controls="dropdown-example"
        data-collapse-toggle="dropdown-example"
      >
        <item.icon className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />

        <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">{item.route}</span>
        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>
      <ul id="dropdown-example" className={`${display ? "" : "hidden"} py-2 space-y-2`}>
        {item.options.map((item) => (
          <div key={item.route} className="pl-11">
            <NavItem item={item} />
          </div>
        ))}
        {/* <li>
          <a
            href="#"
            className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
          >
            Products
          </a>
        </li> */}
      </ul>
    </li>
  );
}
