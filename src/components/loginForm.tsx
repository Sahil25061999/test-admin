"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { CHRYSUS_API, MOI_API, refreshInstance } from "../config";
import { useToast } from "../context/toast.context";
import { useAuth } from "../context/auth";
import { signIn } from "next-auth/react";
import CryptoJS from 'crypto-js';
import { useAuthAxios } from "../hooks/useAuthAxios";
export const encryptToken = (plainText, key) => {
  try {
    // Convert key and plainText to CryptoJS format
    const keyBytes = CryptoJS.enc.Hex.parse(key); // Key in Hex format
    const iv = CryptoJS.lib.WordArray.random(16); // Generate 16-byte IV

    // Encrypt using AES-CBC with PKCS7 padding (default)
    const encrypted = CryptoJS.AES.encrypt(plainText, keyBytes, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    // Concatenate IV and ciphertext
    const ivCipher = iv.concat(encrypted.ciphertext as any);

    // Base64 encode the result
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
  const [displayOtpInput, setDisplayOtpInput] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { setToken, setPhone,setRefreshToken } = useAuth();
  const router = useRouter();
  const apiInstance = useAuthAxios()

  const togglePasswordVisibility = (e: FormEvent) => {
    e.preventDefault();
    setShowPassword((prev) => !prev);
  };

  const handleInputs = (e: ChangeEvent<HTMLInputElement>, userField: string) => {
    if(displayOtpInput && userField !== "otp"){
      setDisplayOtpInput(false);
    }
    setUserCredentials((prev) => ({ ...prev, [userField]: e.target.value }));
  };

  const handleVerifyOtp = async () => {
  try {
    setLoading(true);
    const res = await signIn("credentials", {
      redirect: true,
      phone: userCredentials.phone,
      otp: userCredentials.otp,
      callbackUrl: "/dashboard",
    });

    // if (res?.ok) {
    //   toast({ title: "Success", description: "Welcome!", variant: "success" });

    //   if (!["7010935074", "7401592702", "0000123456"].includes(userCredentials.phone)) {
    //     router.push("/gold-redemption");
    //     return;
    //   }
    //   router.push("/dashboard");
    // } else {
    //   toast({ title: "Error", description: "Invalid OTP" });
    // }
  } catch (err) {
    toast({ title: "Error", description: "Something went wrong." });
    console.error(err);
  } finally {
    setLoading(false);
  }
};
  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const params = {
        countryCode: userCredentials.countryCode,
        phone: userCredentials.phone,
      };
      const resp = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
      const data = await resp.json();

      if (data?.success) {
        toast({
          title: "Success",
          description: "Otp Sent Successfully",
          variant: "success",
        });
        setDisplayOtpInput(true);
        // localStorage.setItem("token", resp.data.token);
        // document.cookie = "token" + "=" + resp.data.token + "; Path=/;";
        // router.replace("/dashboard");
      }
    } catch (e) {
      toast({
        title: "Error",
        description: "Try again after sometime",
      });
      console.error(e);
    } finally {
      setLoading(false);
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
    <form className="space-y-6" method="POST">
      <div>
        <label htmlFor="phone" className="block text-xs font-medium text-gray-700 ">
          Phone
        </label>
        <div className="mt-1">
          <input
            id="phone"
            name="phone"
            type="phone"
            autoComplete="phone"
            required
            placeholder="Enter phone"
            className="w-full rounded-full border text-gray-950 dark:border-white py-4 px-7 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
            onChange={(e) => handleInputs(e, "phone")}
          />
        </div>
      </div>
      {displayOtpInput && (
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="otp" className="block text-xs font-medium text-gray-700 ">
              otp
            </label>
          </div>
          <div className="mt-1 w-full rounded-full py-2 px-4 border border-white flex">
            <input
              id="otp"
              name="otp"
              autoComplete="current-otp"
              required
              placeholder="Enter otp"
              onChange={(e) => {
                handleInputs(e, "otp");
              }}
              type={showPassword ? "password" : "text"}
              className="border-none placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:ring-0"
            />
            <button className=" ml-auto text-sm text-slate-500" onClick={togglePasswordVisibility}>
              {showPassword ? "Show" : "hide"}
            </button>
          </div>
        </div>
      )}

      <div className=" mt-4">
        <button
          disabled={loading}
          onClick={displayOtpInput ? handleVerifyOtp : handleSendOtp}
          type="submit"
          className="flex w-full justify-center rounded-full bg-primary px-3 py-4 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {loading ? "loading" : displayOtpInput ? "Verify Otp" : "Send Otp"}
        </button>
        {displayOtpInput ? (
          <button className=" mt-4 text-indigo-500 cursor-pointer" onClick={handleSendOtp}>
            Resend Otp{" "}
          </button>
        ) : null}
      </div>
    </form>
  );
};
