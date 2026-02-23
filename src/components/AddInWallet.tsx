'use client'
import { useState } from "react";
import { useAppContext } from "../context/app";
import { useToast } from "../context/toast.context";
import InputField from "./ui/InputField";

const AddInWallet = ({
  phone_number,
  onSuccess,
}: {
  phone_number: string;
  onSuccess: () => void;
}) => {
  const { setSidebarOpen, setSidebarContent } = useAppContext();
  const { toast } = useToast();

  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* ================= Validation ================= */

  const validateForm = () => {
    if (!amount || Number(amount) <= 0) {
      setError("Enter a valid amount");
      return false;
    }

    if (!note.trim()) {
      setError("Enter a valid note");
      return false;
    }

    setError(null);
    return true;
  };

  /* ================= Submit ================= */

  const handleAddAmount = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const res = await fetch("/api/fiat-wallet/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(amount),
          note: note.trim(),
          phone_number,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setAmount("");
        setNote("");
        onSuccess();
        setSidebarOpen(false);
        setSidebarContent(null);

        toast({
          title: "Success",
          description: data.message,
          variant: "success",
        });
      } else {
        toast({
          title: "Error",
          description: data.message,
          variant: "error",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Something went wrong",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setAmount("");
    setNote("");
    setError(null);
  };

  /* ================= UI ================= */

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {/* Amount */}
        <InputField
          label="Amount"
          inputMode="decimal"
          value={amount}
          onChange={(e) => {
            const val = e.target.value;
            if (/^\d*\.?\d{0,2}$/.test(val)) {
              setAmount(val);
              setError(null);
            }
          }}
          error={error || undefined}
        />

        {/* Note */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Note
          </label>
          <textarea
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
              setError(null);
            }}
            rows={4}
            className={`w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-primary ${error ? "border-red-500" : "border-gray-300"
              }`}
            placeholder="Add a note..."
          />
          {error && (
            <p className="mt-1 text-sm text-red-500">{error}</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-gray-200 bg-white p-4">
        <div className="flex items-center gap-3">
          <button
            className="flex-1 bg-primary text-white py-2 rounded disabled:opacity-50"
            onClick={handleAddAmount}
            disabled={loading}
          >
            {loading ? "Processing..." : "Add Amount"}
          </button>

          <button
            onClick={handleCancel}
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddInWallet;
