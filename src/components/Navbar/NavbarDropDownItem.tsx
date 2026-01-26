"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { NavItem } from "./NavItem";

export function NavDropDownItem({ item }: any) {
  const [open, setOpen] = useState(false);

  return (
    <li>
      {/* ===== Parent ===== */}
      <button
        onClick={() => setOpen((p) => !p)}
        type="button"
        className={`
          group relative flex w-full items-center justify-between gap-3
          px-3 py-2.5 rounded-xl text-sm
          transition-all duration-200
          text-gray-600 hover:bg-gray-50 hover:text-gray-900
        `}
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          {item.icon && (
            <item.icon
              className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors"
            />
          )}
          <span className="font-medium">{item.route}</span>
        </div>

        <ChevronDown
          className={`
            h-4 w-4 text-gray-400 transition-transform duration-200
            ${open ? "rotate-180" : ""}
          `}
        />
      </button>

      {/* ===== Children ===== */}
      <ul
        className={`
          mt-1 space-y-1 overflow-hidden
          transition-all duration-300 ease-out
          ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        {item.options.map((option: any) => (
          <div
            key={option.route}
            className="relative ml-4 pl-4 border-l border-gray-200"
          >
            <NavItem item={option} />
          </div>
        ))}
      </ul>
    </li>
  );
}
