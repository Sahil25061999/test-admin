"use client";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { CHRYSUS_API, MOI_API, refreshInstance } from "../config";
import { useToast } from "../context/toast.context";
import { useAuth } from "../context/auth";
import { signIn } from "next-auth/react";
import CryptoJS from 'crypto-js';
import { useAuthAxios } from "../hooks/useAuthAxios";
import { Loader2 } from "lucide-react";

export const encryptToken = (plainText, key) => {
  try {
    const keyBytes = CryptoJS.enc.Hex.parse(key);
    const iv = CryptoJS.lib.WordArray.random(16);
    const encrypted = CryptoJS.AES.encrypt(plainText, keyBytes, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    const ivCipher = iv.concat(encrypted.ciphertext as any);
    return CryptoJS.enc.Base64.stringify(ivCipher);
  } catch (error) {
    console.error("Encryption Error:", error);
  }
};

export const LoginForm = () => {
  const [userCredentials, setUserCredentials] = useState({
    countryCode: "91",
    phone: "",
    otp: "",
  });
  const [errors, setErrors] = useState<{
    phone?: string;
    otp?: string;
  }>({});
  const [displayOtpInput, setDisplayOtpInput] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { setToken, setPhone, setRefreshToken } = useAuth();
  const router = useRouter();
  const apiInstance = useAuthAxios();

  const validatePhone = (phone: string) => {
    if (!phone) return "Phone number is required";
    if (!/^\d{10}$/.test(phone)) return "Enter a valid 10-digit phone number";
    return "";
  };

  const validateOtp = (otp: string) => {
    if (!otp) return "OTP is required";
    if (otp.length !== 6) return "Invalid OTP";
    return "";
  };

  const togglePasswordVisibility = (e: FormEvent) => {
    e.preventDefault();
    setShowPassword((prev) => !prev);
  };

  const handleInputs = (e: ChangeEvent<HTMLInputElement>, userField: string) => {
    if (displayOtpInput && userField !== "otp") {
      setDisplayOtpInput(false);
    }
    setUserCredentials((prev) => ({
      ...prev,
      [userField]: e.target.value,
    }));
  };

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();

    const otpError = validateOtp(userCredentials.otp);
    if (otpError) {
      setErrors({ otp: otpError });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await signIn("credentials", {
        redirect: true,
        phone: userCredentials.phone,
        otp: userCredentials.otp,
        callbackUrl: "/dashboard",
      });
    } catch (err) {
      setErrors({ otp: "Invalid OTP" });
      toast({
        title: "Error",
        description: "Invalid OTP",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault();

    const phoneError = validatePhone(userCredentials.phone);
    if (phoneError) {
      setErrors({ phone: phoneError });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const resp = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          countryCode: userCredentials.countryCode,
          phone: userCredentials.phone,
        }),
      });

      const data = await resp.json();
      console.log(data?.message);

      if (data?.success) {
        toast({
          title: "Success",
          description: "OTP sent successfully",
          variant: "success",
        });
        setDisplayOtpInput(true);
      } else {
        toast({
          title: "Error",
          description: data?.message || "Failed to send OTP",
          variant: "error",
        });
        setErrors({ phone: data?.message || "Failed to send OTP" });
      }
    } catch (e) {
      setErrors({ phone: "Try again later" });
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (displayOtpInput) {
      handleVerifyOtp(e);
    } else {
      handleSendOtp(e);
    }
  };

  useEffect(() => {
    const encryptedAccessToken = encryptToken(
      "N#8v!zXq3eP$wLr7@U2jT%9kBm5Qf4Y1",
      "6f8f57715090da2632453988d9a1501b6d4f7dffed6a532f1e3a7865e837a69a"
    );
    CHRYSUS_API.defaults.headers["X-Auth-Token"] = JSON.stringify(encryptedAccessToken);
    refreshInstance.defaults.headers["X-Auth-Token"] = JSON.stringify(encryptedAccessToken);
  }, []);

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Phone</label>
        <input
          type="tel"
          placeholder="Enter phone number"
          value={userCredentials.phone}
          onChange={(e) => {
            handleInputs(e, "phone");
            setErrors((prev) => ({ ...prev, phone: "" }));
          }}
          disabled={loading}
          className={`w-full rounded-full py-4 px-7 text-sm placeholder:text-gray-400 border ${errors.phone
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-indigo-500"
            } focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed`}
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
        )}
      </div>

      {displayOtpInput && (
        <div>
          <label className="block text-sm font-medium mb-2">OTP</label>
          <div className="relative flex items-center">
            <input
              type={showPassword ? "password" : "text"}
              placeholder="Enter OTP"
              value={userCredentials.otp}
              onChange={(e) => {
                handleInputs(e, "otp");
                setErrors((prev) => ({ ...prev, otp: "" }));
              }}
              disabled={loading}
              maxLength={6}
              className="flex-1 bg-transparent text-sm placeholder:text-gray-400 border-0 outline-none ring-0 focus:outline-none focus:ring-0 focus:border-0 appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="text-sm text-indigo-600 hover:text-indigo-700"
              disabled={loading}
            >
              {showPassword ? "Show" : "Hide"}
            </button>
          </div>
          {errors.otp && (
            <p className="mt-1 text-sm text-red-500">{errors.otp}</p>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-3 rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {loading ? (
          <Loader2 className="animate-spin" />
        ) : displayOtpInput ? (
          "Verify OTP"
        ) : (
          "Send OTP"
        )}
      </button>

      {displayOtpInput && (
        <button
          type="button"
          onClick={handleSendOtp}
          disabled={loading}
          className="w-full text-indigo-600 hover:text-indigo-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Resend OTP
        </button>
      )}
    </form>
  );
};


