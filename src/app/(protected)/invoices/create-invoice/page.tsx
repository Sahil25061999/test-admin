"use client";
import { useState } from "react";

import { Loader2, Phone, Hash, FileText } from "lucide-react";
import { PageHeader } from "../../../../components/dashboard/PageHeader";
import InputField from "../../../../components/ui/InputField";
import { useToast } from "../../../../context/toast.context";
import PillSelect from "../../../../components/ui/PillSelect";

export default function Page() {
  const [phone, setPhone] = useState("");


  const [txnId, setTxnId] = useState("");
  const [txnType, setTxnType] = useState("");
  const { toast } = useToast();
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!phone) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(phone)) {
      errors.phone = "Phone must be 10 digits";
    }

    if (!txnId) {
      errors.txnId = "Transaction ID is required";
    } else if (txnId.length < 5) {
      errors.txnId = "Transaction ID must be at least 5 characters";
    }

    if (!txnType) {
      errors.txnType = "Transaction type is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setPhone("");
    setTxnId("");
    setTxnType("");
    setFormErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/create-invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone_number: phone,
          txn_id: txnId,
          txn_type: txnType,
        }),
      });

      const data = await res.json();

      if (data?.success) {
        toast({
          title: "Invoice Created",
          description: data?.message || "Invoice generated successfully",
          variant: "success",
        });
        resetForm();
      } else {
        toast({
          title: "Failed",
          description: data?.message || "Unable to create invoice",
          variant: "error",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <PageHeader
        title="Create Invoice"
        subtitle="Generate invoice for completed transactions"

      />

      <div className="py-6">
        <div className="mx-auto bg-white rounded-md my-4 border border-gray-200 p-6 space-y-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Create Invoice
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5 ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Customer Phone Number"
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (formErrors.phone)
                    setFormErrors({ ...formErrors, phone: "" });
                }}
                placeholder="Enter 10-digit phone number"
                icon={Phone}
                required
                error={formErrors.phone}
              />

              <InputField
                label="Transaction ID"
                type="text"
                value={txnId}
                onChange={(e) => {
                  setTxnId(e.target.value);
                  if (formErrors.txnId)
                    setFormErrors({ ...formErrors, txnId: "" });
                }}
                placeholder="Enter transaction ID"
                icon={Hash}
                required
                error={formErrors.txnId}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">
                Transaction Type
                <span className="text-red-500 ml-1">*</span>
              </label>
              <PillSelect value={txnType} onChange={(v) => setTxnType(v)} options={[
                { value: "REDEEM-GOLD", label: "Redeem Gold" },
                { value: "REDEEM-SILVER", label: "Redeem Silver" },
                { value: "SELL", label: "Sell" },
              ]} />


            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary text-white py-2.5 px-6 rounded-md hover:bg-primary/80 transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center text-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Invoice...
                  </>
                ) : (
                  "Create Invoice"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
