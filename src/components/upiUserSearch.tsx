"use client";
import { Loader2, Search } from "lucide-react";
import React from "react";

interface UpiUserSearchProps {
  input: string;
  setInput: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  placeholder: string;
  loading?: boolean;
  helperText?: string;
}

export function UpiUserSearch({
  input,
  setInput,
  handleSubmit,
  placeholder,
  loading = false,
  helperText,
}: UpiUserSearchProps) {
  return (
    <form onSubmit={handleSubmit} className="w-full my-6 px-4">
      <div
        className="
      flex items-stretch
      rounded-md bg-white
      border border-gray-200

      overflow-hidden
      transition-all
    "
      >
        {/* Left section */}
        <div className="flex items-center gap-2 px-4 py-1 flex-1">
          <Search className="hidden sm:block h-4 w-4 text-gray-400" />

          <input
            type="text"
            inputMode="numeric"
            placeholder={placeholder}
            required
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="
          flex-1 bg-transparent border-none
          text-sm text-gray-900 placeholder:text-gray-400
          focus:outline-none focus:ring-0
          disabled:opacity-50
        "
          />
        </div>

        {/* Right button – touches edge */}
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="
        flex items-center justify-center gap-2
        px-12
        text-sm font-semibold text-white
        bg-primary
        transition-all
        hover:bg-primary/90
        active:scale-[0.98]
        disabled:opacity-50 disabled:cursor-not-allowed
        whitespace-nowrap
      "
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Searching</span>
            </>
          ) : (
            <>
              <Search className="h-4 w-4 sm:hidden" />
              <span>Search</span>
            </>
          )}
        </button>
      </div>

      {helperText && (
        <p className="mt-2 text-center text-xs text-gray-500">
          {helperText}
        </p>
      )}
    </form>

  );
}
