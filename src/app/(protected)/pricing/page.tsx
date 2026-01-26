"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "../../../components/dashboard/PageHeader";
import TextAreaField from "../../../components/ui/TextAreaField";
import { useToast } from "../../../context/toast.context";
import { Loader2 } from "lucide-react";
import PillSelect from "../../../components/ui/PillSelect";

export default function Page() {
  const [key, setKey] = useState("GOLD24_BUY_SPREAD_PERC");
  const [value, setValue] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [fetchingValue, setFetchingValue] = useState(false);
  const [saving, setSaving] = useState(false);

  const { toast } = useToast();

  const KEY_TYPES = [
    { label: "Gold Buy Spread", value: "GOLD24_BUY_SPREAD_PERC" },
    { label: "Gold Sell Spread", value: "GOLD24_SELL_SPREAD_PERC" },
    { label: "Silver Buy Spread", value: "SILVER24_BUY_SPREAD_PERC" },
    { label: "Silver Sell Spread", value: "SILVER24_SELL_SPREAD_PERC" },
    { label: "GST", value: "GST" },
    { label: "Offer Discount", value: "OFFER_DISCOUNT" },
  ];

  useEffect(() => {
    if (!key) return;

    const controller = new AbortController();
    setFetchingValue(true);
    setValue("");

    const fetchConfig = async () => {
      try {
        const res = await fetch(`/api/config/${key}`, {
          signal: controller.signal,
        });

        if (!res.ok) throw new Error("Fetch failed");

        const response = await res.json();
        setValue(String(response?.data?.value ?? ""));
      } catch (err: any) {
        if (err.name !== "AbortError") {
          toast({
            title: "Error",
            description: "Failed to load configuration",
          });
        }
      } finally {
        setFetchingValue(false);
      }
    };

    fetchConfig();
    return () => controller.abort();
  }, [key, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: Record<string, string> = {};
    if (!key) errors.key = "Key is required";
    if (!value) errors.value = "Value is required";

    setFormErrors(errors);
    if (Object.keys(errors).length) return;

    setSaving(true);
    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: Number(value) }),
      });

      const data = await res.json();

      if (data?.success) {
        toast({
          title: "Success",
          description: data.message,
          variant: "success",
        });
      } else {
        throw new Error(data?.message);
      }
    } catch {
      toast({
        title: "Error",
        description: "Save failed",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader title="Pricing" subtitle="Configure the prices here" />

      <div className="rounded-xl border mt-8 border-gray-200 bg-white shadow-sm mb-4">
        <div className="p-6 space-y-6">
          <h1 className="text-xl font-semibold">Pricing</h1>

          <PillSelect
            options={KEY_TYPES}
            value={key}
            onChange={setKey}
            disabled={fetchingValue || saving}
          />

          <div className="relative">
            {fetchingValue && (
              <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center rounded-md">
                <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
              </div>
            )}

            <TextAreaField
              label="Value"
              value={value}
              disabled={fetchingValue || saving}
              onChange={(e) => {
                const raw = e.target.value;
                if (raw === "" || /^-?\d*\.?\d*$/.test(raw)) {
                  setValue(raw);
                }
              }}
              onBlur={() => {
                if (value !== "" && !isNaN(Number(value))) {
                  setValue(String(Number(value)));
                }
              }}
              required
              error={formErrors.value}
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSubmit}
              disabled={saving || fetchingValue}
              className="bg-primary text-white py-2.5 px-6 rounded-md font-medium
                flex items-center justify-center
                disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save Configuration"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
