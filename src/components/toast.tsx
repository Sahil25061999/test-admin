import React from "react";
import { useToast } from "../context/toast.context";
import { CheckCircle2, XCircle, AlertCircle, X } from "lucide-react";

export function Toast() {
  const { content } = useToast();

  const variants = {
    success: {
      bg: "bg-white",
      border: "border-emerald-600",
      icon: CheckCircle2,
      iconColor: "text-emerald-600"
    },
    error: {
      bg: "bg-white",
      border: "border-red-600",
      icon: X,
      iconColor: "text-red-600"
    },
    warning: {
      bg: "bg-white",
      border: "border-amber-600",
      icon: AlertCircle,
      iconColor: "text-amber-600"
    },
    neutral: {
      bg: "bg-white",
      border: "border-slate-400",
      icon: AlertCircle,
      iconColor: "text-slate-600"
    }
  };

  const variant = variants[content.variant] || variants.neutral;
  const Icon = variant.icon;

  return (
    <div
      className={`fixed bottom-4 right-4 z-[9999] transition-all duration-300 ${content.display
        ? "translate-y-0 opacity-100"
        : "translate-y-4 opacity-0 pointer-events-none"
        }`}
    >
      <div
        className={`${variant.bg} ${variant.border} border-l-4 shadow-lg rounded-md p-4 min-w-[360px] max-w-md`}
      >
        <div className="flex items-start gap-3">
          <Icon className={`w-5 h-5 ${variant.iconColor} flex-shrink-0 mt-0.5`} strokeWidth={2} />

          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 text-sm mb-1">
              {content.title}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {content.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}