"use client"
import { useState } from "react"

type PillOption = {
  label: string
  value: string
}

function PillSelect({
  label,
  value,
  options,
  onChange,
  disabled,
}: {
  label?: string
  value: string
  options: PillOption[]
  onChange: (v: string) => void
  disabled?: boolean
}) {
  const MAX_VISIBLE = 10
  const [showAll, setShowAll] = useState(false)

  const visibleOptions =
    showAll ? options : options.slice(0, MAX_VISIBLE)

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium mb-1">{label}</label>
      )}

      <div className="flex flex-wrap gap-2">
        {visibleOptions.map(opt => {
          const active = value === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              disabled={disabled}
              className={`px-3 py-1.5 rounded-full text-sm border transition
                ${active
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-700 border-gray-300 hover:border-primary"
                }`}
            >
              {opt.label}
            </button>
          )
        })}

        {options.length > MAX_VISIBLE && (
          <button
            type="button"
            onClick={() => setShowAll(prev => !prev)}
            className="px-3 py-1.5 rounded-full text-sm border border-dashed text-primary hover:bg-primary/10"
          >
            {showAll ? "Show less" : `+${options.length - MAX_VISIBLE} more`}
          </button>
        )}
      </div>
    </div>
  )
}

export default PillSelect
