"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Loader2, Search } from "lucide-react";

import { PageHeader } from "../../../components/dashboard/PageHeader";
import { useToast } from "../../../context/toast.context";
import PillSelect from "../../../components/ui/PillSelect";
import InputField from "../../../components/ui/InputField";

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

export default function Page() {
  const { toast } = useToast();

  const [key, setKey] = useState("");
  const [value, setValue] = useState<string>("{}");

  const [allKeys, setAllKeys] = useState<string[]>([]);
  const [filteredKeys, setFilteredKeys] = useState<string[]>([]);
  const [query, setQuery] = useState("");

  const [jsonError, setJsonError] = useState<string | null>(null);

  const [keysLoading, setKeysLoading] = useState(false);
  const [valueLoading, setValueLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const KEY_TYPES = [
    "GOLD24_BUY_SPREAD_PERC",
    "GOLD24_SELL_SPREAD_PERC",
    "SILVER24_BUY_SPREAD_PERC",
    "SILVER24_SELL_SPREAD_PERC",
    "GST",
    "OFFER_DISCOUNT",
  ];


  const toJsonString = (data: any) => {
    try {
      if (typeof data === "string") {
        return JSON.stringify(JSON.parse(data), null, 2);
      }
      return JSON.stringify(data ?? {}, null, 2);
    } catch {
      return "{}";
    }
  };

  const validateJson = (content: string) => {
    try {
      JSON.parse(content);
      setJsonError(null);
      return true;
    } catch (err: any) {
      setJsonError(err.message || "Invalid JSON");
      return false;
    }
  };


  useEffect(() => {
    const fetchKeys = async () => {
      setKeysLoading(true);
      try {
        const res = await fetch("/api/config");
        const response = await res.json();

        if (response?.success) {
          const keys = response.data.keys.filter(
            (k: string) => !KEY_TYPES.includes(k)
          );
          setAllKeys(keys);
          setFilteredKeys(keys);
        }
      } catch {
        toast({ title: "Error", description: "Failed to fetch keys" });
      } finally {
        setKeysLoading(false);
      }
    };

    fetchKeys();
  }, []);


  useEffect(() => {
    setFilteredKeys(
      allKeys.filter((k) =>
        k.toLowerCase().includes(query.toLowerCase())
      )
    );
  }, [query, allKeys]);


  useEffect(() => {
    if (!key) {
      setValue("{}");
      return;
    }

    const controller = new AbortController();

    const fetchValue = async () => {
      setValueLoading(true);
      try {
        const res = await fetch(`/api/config/${key}`, {
          signal: controller.signal,
        });
        const response = await res.json();
        setValue(toJsonString(response?.data?.value));
        setJsonError(null);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          toast({ title: "Error", description: "Failed to load value" });
        }
      } finally {
        setValueLoading(false);
      }
    };

    fetchValue();
    return () => controller.abort();
  }, [key]);


  const handleSubmit = async () => {
    if (!key) {
      toast({ title: "Error", description: "Select a key first" });
      return;
    }

    if (!validateJson(value)) {
      toast({ title: "Invalid JSON", description: jsonError ?? "" });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: JSON.parse(value) }),
      });

      const data = await res.json();

      if (data?.success) {
        toast({
          title: "Saved",
          description: "Configuration updated",
          variant: "success",
        });
      } else {
        throw new Error(data?.message);
      }
    } catch {
      toast({ title: "Error", description: "Save failed" });
    } finally {
      setSaving(false);
    }
  };


  return (
    <div className="space-y-6">
      <PageHeader
        title="Config"
        subtitle="JSON-only configuration editor"
      />

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">

        <InputField
          label="Search Key"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search config key…"

        />

        {keysLoading ? (
          <div className="flex gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-8 w-28 rounded-full bg-gray-200 animate-pulse"
              />
            ))}
          </div>
        ) : filteredKeys.length === 0 ? (
          <p className="text-sm text-gray-500 italic">
            No matching keys found
          </p>
        ) : (
          <PillSelect
            value={key}
            onChange={setKey}
            options={filteredKeys.map((k) => ({
              value: k,
              label: k,
            }))}
          />
        )}

        <div className="relative border rounded-lg overflow-hidden">
          {valueLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
              <Loader2 className="animate-spin" />
            </div>
          )}

          <Editor
            key={key}
            height="360px"
            language="json"
            value={value}
            onChange={(val) => {
              if (typeof val === "string") {
                setValue(val);
                validateJson(val);
              }
            }}
            options={{
              readOnly: valueLoading,
              minimap: { enabled: false },
              wordWrap: "on",
              tabSize: 2,
              automaticLayout: true,
            }}
          />
        </div>

        {jsonError && (
          <p className="text-sm text-red-600"> {jsonError}</p>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={saving || valueLoading}
            className="bg-primary text-white px-5 py-2 rounded-md flex items-center gap-2 disabled:opacity-60"
          >
            {saving && <Loader2 className="animate-spin" size={16} />}
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
