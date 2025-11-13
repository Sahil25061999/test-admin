"use client";
import React, { useState } from "react";
import { clientApi } from "../../../lib/client-api";

type ScreenName = "HOME_SCREEN_CONFIG" | "AUTOSAVINGS_CONFIG" | "SELL_CONFIG";

const Page = () => {
  const [selectedScreen, setSelectedScreen] = useState<ScreenName>("HOME_SCREEN_CONFIG");
  const [jsonContent, setJsonContent] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Map screen names to display names
  const screenOptions: { value: ScreenName; label: string }[] = [
    { value: "HOME_SCREEN_CONFIG", label: "Home Screen" },
    { value: "AUTOSAVINGS_CONFIG", label: "Autosavings" },
    { value: "SELL_CONFIG", label: "Sell" },
  ];

  // Convert screen name to API format
  const getApiScreenName = (screenName: ScreenName): string => {
    const mapping: Record<ScreenName, string> = {
      HOME_SCREEN_CONFIG: "home_screen",
      AUTOSAVINGS_CONFIG: "autosavings",
      SELL_CONFIG: "sell",
    };
    return mapping[screenName];
  };

  // Load configuration
  const loadConfiguration = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    setJsonError(null);

    try {
      const apiScreenName = getApiScreenName(selectedScreen);
      const response = await clientApi.getScreenConfig(apiScreenName);

      if (response.success && response.data) {
        // Format JSON with proper indentation
        setJsonContent(JSON.stringify(response.data, null, 2));
      } else {
        setError(response.message || "Failed to load configuration");
        setJsonContent("");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load configuration");
      setJsonContent("");
    } finally {
      setLoading(false);
    }
  };

  // Validate JSON
  const validateJson = (content: string): boolean => {
    try {
      JSON.parse(content);
      setJsonError(null);
      return true;
    } catch (err: any) {
      setJsonError(err.message || "Invalid JSON");
      return false;
    }
  };

  // Handle JSON content change
  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    setJsonContent(content);
    if (content.trim()) {
      validateJson(content);
    } else {
      setJsonError(null);
    }
  };

  // Save configuration
  const saveConfiguration = async () => {
    if (!jsonContent.trim()) {
      setError("Please enter configuration data");
      return;
    }

    if (!validateJson(jsonContent)) {
      setError("Invalid JSON format. Please fix the errors.");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const configData = JSON.parse(jsonContent);
      const apiScreenName = getApiScreenName(selectedScreen);
      const response = await clientApi.updateScreenConfig(apiScreenName, configData);

      if (response.success) {
        setSuccess("Configuration updated successfully!");
        // Reload to get the updated configuration
        setTimeout(() => {
          loadConfiguration();
        }, 1000);
      } else {
        setError(response.message || "Failed to update configuration");
      }
    } catch (err: any) {
      setError(err.message || "Failed to update configuration");
    } finally {
      setSaving(false);
    }
  };

  // Format JSON on blur
  const handleJsonBlur = () => {
    if (jsonContent.trim()) {
      try {
        const parsed = JSON.parse(jsonContent);
        setJsonContent(JSON.stringify(parsed, null, 2));
        setJsonError(null);
      } catch (err) {
        // Keep the content as is if invalid
      }
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">LMS Screen Configuration</h1>

      {/* Screen Selector */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Select Screen</label>
        <select
          value={selectedScreen}
          onChange={(e) => {
            setSelectedScreen(e.target.value as ScreenName);
            setJsonContent("");
            setError(null);
            setSuccess(null);
            setJsonError(null);
          }}
          className="w-full max-w-md border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {screenOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={loadConfiguration}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Loading..." : "Load Configuration"}
        </button>
        <button
          onClick={saveConfiguration}
          disabled={saving || loading || !jsonContent.trim() || !!jsonError}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : "Save Configuration"}
        </button>
      </div>

      {/* Messages */}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">{success}</div>}
      {jsonError && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          JSON Error: {jsonError}
        </div>
      )}

      {/* JSON Editor */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Configuration JSON</label>
        <textarea
          value={jsonContent}
          onChange={handleJsonChange}
          onBlur={handleJsonBlur}
          placeholder='{"priorityList": [], "sections": {}}'
          className={`w-full h-96 font-mono text-sm border rounded-md p-4 focus:outline-none focus:ring-2 ${
            jsonError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
          }`}
          spellCheck={false}
        />
        <p className="text-xs text-gray-500">
          Edit the JSON configuration above. The JSON will be automatically formatted on blur.
        </p>
      </div>
    </div>
  );
};

export default Page;
