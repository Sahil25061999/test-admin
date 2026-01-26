import { AlertCircle } from "lucide-react";

const InputField = ({
  label,
  value,
  onChange,
  disabled = false,
  placeholder,
  type = "text",
  icon: Icon,
  error,
  required = false
}: any) => (

  <div className="space-y-1.5">
    <label className="block text-sm font-medium text-slate-700">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>

    <div className="relative">
      {Icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Icon className="h-5 w-5 text-slate-400" strokeWidth={2} />
        </div>
      )}

      <input
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2.5 text-sm border ${error
          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
          : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500'
          } rounded-md focus:outline-none focus:ring-1 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors`}
      />
    </div>

    {error && (
      <div className="flex items-center gap-1.5 text-xs text-red-600 mt-1.5">
        <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={2} />
        <span>{error}</span>
      </div>
    )}
  </div>
);

export default InputField;