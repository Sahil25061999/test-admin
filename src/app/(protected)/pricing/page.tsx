"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "../../../components/dashboard/PageHeader";
import TextAreaField from "../../../components/ui/TextAreaField";
import { useToast } from "../../../context/toast.context";
import { Loader2 } from "lucide-react";
import PillSelect from "../../../components/ui/PillSelect";

type SourceData = {
  gold: { source: string };
  silver: { source: string };
};

const METAL_OPTIONS = [
  { label: "Gold", value: "gold" },
  { label: "Silver", value: "silver" },
];

const SOURCE_OPTIONS = [
  { label: "SURABHI", value: "SURABHI" },
  { label: "ARIHANT", value: "ARIHANT" },
  { label: "SLN", value: "SLN" },
];

export default function Page() {
  const { toast } = useToast();

  const [key, setKey] = useState("GOLD24_BUY_SPREAD_PERC");
  const [value, setValue] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [fetchingValue, setFetchingValue] = useState(false);
  const [saving, setSaving] = useState(false);

  const [loadingSource, setLoadingSource] = useState(false);
  const [updatingSource, setUpdatingSource] = useState(false);
  const [selectedMetal, setSelectedMetal] = useState<"gold" | "silver">("gold");
  const [selectedSource, setSelectedSource] = useState("ARIHANT");
  const [sourceData, setSourceData] = useState<SourceData | null>(null);

  const [priceProduct, setPriceProduct] = useState<"24KGOLD" | "24KSILVER">("24KGOLD");
  const [updatingPrice, setUpdatingPrice] = useState(false);

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


  const fetchSource = async () => {
    try {
      setLoadingSource(true);
      const res = await fetch("/api/source");
      const response = await res.json();

      const sourceData = response.data;
      setSourceData(sourceData);
      setSelectedSource(sourceData[selectedMetal].source.toUpperCase());
    } catch (error) {
      console.error("Error fetching source:", error);
      toast({
        title: "Error",
        description: "Failed to load source configuration",
        variant: "error",
      });
    } finally {
      setLoadingSource(false);
    }
  };

  useEffect(() => {
    fetchSource();
  }, []);

  useEffect(() => {
    if (!sourceData) return;

    const metalConfig = sourceData[selectedMetal];
    if (metalConfig?.source) {
      setSelectedSource(metalConfig.source.toUpperCase());
    }
  }, [selectedMetal, sourceData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: Record<string, string> = {};
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

      if (!data?.success) throw new Error(data?.message);

      toast({
        title: "Success",
        description: data.message,
        variant: "success",
      });
    } catch {
      toast({
        title: "Error",
        description: "Save failed",
      });
    } finally {
      setSaving(false);
    }
  };

  const isDirty =
    sourceData?.[selectedMetal]?.source !== selectedSource.toLowerCase();

  const handleUpdateSource = async () => {
    setUpdatingSource(true);
    try {
      const response = await fetch("/api/source", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metal: selectedMetal,
          source: selectedSource,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Source updated successfully",
          variant: "success",
        });
        fetchSource();
      } else {
        toast({
          title: "Error",
          description: data.message || "Update failed",
          variant: "error",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update source",
        variant: "error",
      });
    } finally {
      setUpdatingSource(false);
    }
  };
  const handleUpdatePrice = async () => {
    setUpdatingPrice(true);
    try {
      const res = await fetch(`/api/cron?product=${priceProduct}`, {
        method: "GET",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Update failed");

      toast({
        title: "Success",
        description: `${priceProduct === "24KGOLD" ? "Gold" : "Silver"} price updated`,
        variant: "success",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to update price",
      });
    } finally {
      setUpdatingPrice(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Pricing Management"
        subtitle="Configure spreads, sources, and update live prices"
      />

      <div className="mt-8 space-y-6">
        {/* STEP 1: Configure Spread */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Step 1: Configure Spread
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Set the pricing spread percentages and other pricing parameters
              </p>
            </div>

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

            <div className="flex justify-end pt-2 border-t">
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

        {/* STEP 2: Configure Source */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Step 2: Configure Pricing Source
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Select the vendor providing live market rates for each metal
              </p>
            </div>

            {loadingSource ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-700">
                    Metal Type
                  </h3>
                  <PillSelect
                    options={METAL_OPTIONS}
                    value={selectedMetal}
                    onChange={(val) =>
                      setSelectedMetal(val as "gold" | "silver")
                    }
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-700">
                    Pricing Source
                  </h3>
                  <PillSelect
                    options={SOURCE_OPTIONS}
                    value={selectedSource}
                    onChange={setSelectedSource}
                  />
                </div>

                <div className="flex justify-end pt-2 border-t">
                  <button
                    onClick={handleUpdateSource}
                    disabled={updatingSource || !isDirty}
                    className="bg-primary text-white py-2.5 px-6 rounded-md font-medium
                      flex items-center justify-center
                      disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {updatingSource ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Updating…
                      </>
                    ) : (
                      "Update Source"
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* STEP 3: Update Live Price */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Step 3: Update Live Price
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Manually trigger live market price sync for the selected metal
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700">
                Select Metal
              </h3>
              <PillSelect
                options={[
                  { label: "Gold", value: "24KGOLD" },
                  { label: "Silver", value: "24KSILVER" },
                ]}
                value={priceProduct}
                onChange={setPriceProduct}
                disabled={updatingPrice}
              />
            </div>

            <div className="flex justify-end pt-2 border-t">
              <button
                onClick={handleUpdatePrice}
                disabled={updatingPrice}
                className="bg-primary text-white py-2.5 px-6 rounded-md font-medium
                  flex items-center justify-center
                  disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {updatingPrice ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Updating…
                  </>
                ) : (
                  "Update Price"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}