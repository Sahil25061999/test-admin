import { AlertCircle } from "lucide-react";

const TextAreaField = ({ label, value, onChange, placeholder, error }: any) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={4}
      className={`w-full px-4 py-3 border ${error ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all`}
    />
    {error && (
      <div className="flex items-center gap-1 text-xs text-red-600">
        <AlertCircle className="h-3 w-3" />
        <span>{error}</span>
      </div>
    )}
  </div>
);


export default TextAreaField;