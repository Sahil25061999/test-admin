import React from "react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  rightSlot?: React.ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  icon,
  rightSlot,
}: HeaderProps) {
  return (
    <header className="relative bg-white border-l-4 border-primary shadow-xs  rounded-r-xl">
      <div className="pl-6 pr-6 py-5 flex items-center justify-between gap-4">

        <div className="flex items-start gap-3">
          {icon && (
            <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {icon}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
              {title}
            </h1>

            {subtitle && (
              <p className="text-sm text-gray-500 max-w-xl leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {rightSlot && (
          <div className="flex items-center gap-2 shrink-0">
            {rightSlot}
          </div>
        )}
      </div>
    </header>
  );
}
