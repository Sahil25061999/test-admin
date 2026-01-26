'use clientt'
import { useState } from "react";
import InputField from "../ui/InputField";
import { useToast } from "../../context/toast.context";
import { useAppContext } from "../../context/app";

const AddBankAccount = ({ onSuccess }: {
  onSuccess: () => void
}) => {
  const { setSidebarOpen, setSidebarContent } = useAppContext()
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [errors, setErrors] = useState<{ accountNumber?: string; ifscCode?: string }>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast()

  const validateAccountNumber = (value: string) =>
    /^\d{10,18}$/.test(value);

  const validateIfscCode = (value: string) =>
    /^[A-Z]{4}0[A-Z0-9]{6}$/.test(value);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!validateAccountNumber(accountNumber)) {
      newErrors.accountNumber = "Enter a valid account number";
    }

    if (!validateIfscCode(ifscCode)) {
      newErrors.ifscCode = "Invalid IFSC code";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddAccount = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const res = await fetch("/api/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bank_account: accountNumber,
          ifsc: ifscCode,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAccountNumber("");
        setIfscCode("");
        setErrors({});
        onSuccess()
        setSidebarOpen(false)
        setSidebarContent(null)
        toast({
          title: "Success",
          description: data?.message,
          variant: "success",
        });
      } else {
        toast({
          title: "Error",
          description: data?.message,
          variant: "error",
        });
      }




    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setAccountNumber("");
    setIfscCode("");
    setErrors({});
  };

  return (
    <div className="h-full flex flex-col bg-white">

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <InputField
          label="Account Number"
          value={accountNumber}
          onChange={(e) => {
            setAccountNumber(e.target.value);
            setErrors((prev) => ({ ...prev, accountNumber: "" }));
          }}
          error={errors.accountNumber}
        />

        <InputField
          label="IFSC Code"
          value={ifscCode}
          onChange={(e) => {
            setIfscCode(e.target.value.toUpperCase());
            setErrors((prev) => ({ ...prev, ifscCode: "" }));
          }}
          error={errors.ifscCode}
        />
      </div>


      <div className="shrink-0 border-t border-gray-200 bg-white p-4">
        <div className="flex items-center gap-3">
          <button
            className="flex-1 bg-primary text-white py-2 rounded disabled:opacity-50"
            onClick={handleAddAccount}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Add Account"}
          </button>

          <button
            onClick={handleCancel}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBankAccount;
