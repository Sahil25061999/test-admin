"use client";
import React, { useState } from "react";
import { UpiUserSearch } from "../../../../../components/upiUserSearch";
import { useToast } from "../../../../../context/toast.context";
import { ArrowDownIcon, Bars2Icon } from "@heroicons/react/24/outline";
import { PageHeader } from "../../../../../components/dashboard/PageHeader";
import { ArrowDown, Calendar, Clock, Loader2, Search, Star } from "lucide-react";
import InputField from "../../../../../components/ui/InputField";
import TextAreaField from "../../../../../components/ui/TextAreaField";
import { useAuthAxios } from "../../../../../hooks/useAuthAxios";
import UserProfileSkeleton from "../../../../../components/UserProfile/UserProfileSkeleton";

interface user {
  _id: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  phone_number: string;
  isKycVerified: string;
}
interface UserDetails {
  user: user;
  silver_balance: string;
  wallets: {
    qty_g: string;
  }[];
}

export default function Page() {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [convertLoading, setConvertLoading] = useState(false);
  const [depositLoading, setDepositLoading] = useState(false);
  const [grams, setGrams] = useState("");
  const [silverPrice, setSilverPrice] = useState("");
  const [depositFormat, setDepositFormat] = useState("Grams");
  const [notes, setNotes] = useState("");
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [depositDate, setDepositDate] = useState("");
  const [depositTime, setDepositTime] = useState("");
  const { toast } = useToast();
  const [errors, setErrors] = useState<any>({});
  const apiInstance = useAuthAxios();
  const [depositType, setDepositType] = useState("amt");
  const [isReconciled, setIsReconciled] = useState(false);
  const [reconcileLoading, setReconcileLoading] = useState(false);
  const [isDepositSuccess, setIsDepositSuccess] = useState(false);



  const fetchUserDetails = async (e = null) => {
    e?.preventDefault();
    if (!phone || phone.length !== 10) {
      toast({
        title: "Error",
        description: "Phone number is required and must be 10 digits",
      });
      return;
    }
    setSearchLoading(true);
    try {
      const res = await fetch(`/api/user/${phone}?type=profile`);
      const data = await res.json();
      if (data?.success) {
        setUserDetails(data.data);
        resetDepositForm();
      } else {
        toast({
          title: "Error",
          description: data?.message || "Something went wrong",
        });
      }
    } catch (e) {
      toast({
        title: "Error",
        description: "Something went wrong",
      });
    } finally {
      setSearchLoading(false);
    }
  };

  const resetDepositForm = () => {
    setAmount("");
    setGrams("");
    setNotes("");
    setErrors({});
    setDepositDate("");
    setDepositTime("");
    setConvertLoading(false);
    setDepositLoading(false);

  };

  const handleConvertToGramsFromAmount = async (e) => {
    e.preventDefault();
    let token: string;
    setConvertLoading(true);
    try {
      let block_id = 0;
      const block_id_res = await apiInstance.get("data/v1/prices?product=24KSILVER");
      console.log("block_id_res_____man", block_id_res);
      if (block_id_res && block_id_res.data.success) {
        block_id = block_id_res.data.data.id;
      }
      const res = await apiInstance.get(
        `data/v1/convert?block_id=${block_id}&price_type=buy&input_val=${amount}&input_type=amt&product_type=SILVER`
      );
      if (res?.data?.success) {
        setGrams(res?.data?.data?.output_val);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setConvertLoading(false);
    }
  };

  const handleConvertToAmountFromGrams = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!grams) {
      toast({
        title: "Error",
        description: "Please enter grams to convert",
      });
      return;
    }

    setConvertLoading(true);

    try {
      let block_id = 0;
      const params1 = { action: "prices", product: "24KSILVER" };
      const searchParams1 = new URLSearchParams(params1);
      const block_id_res = await fetch(`/api/data?${searchParams1.toString()}`);
      const block_data = await block_id_res.json();
      console.log("block_data_____man", block_data);

      if (block_data?.success) {
        block_id = block_data.data.id;
      }

      const params2 = {
        action: "convert",
        block_id: block_id.toString(),
        price_type: "sell",
        input_val: grams,
        input_type: "qty",
        product_type: "SILVER",
      };
      const searchParams2 = new URLSearchParams(params2);
      const res = await fetch(`/api/data?${searchParams2.toString()}`);
      const data = await res.json();
      console.log("data_____man", data);

      if (data?.success) {
        setAmount(data.data?.output_val);
      }
    } catch (error) {
      console.error("Error converting amount:", error);
      toast({
        title: "Error",
        description: "Something went wrong",
      });
    } finally {
      setConvertLoading(false);
    }
  };

  const handleConvert = (e: React.FormEvent) => {
    if (depositType === "amt") {
      handleConvertToGramsFromAmount(e);
    } else {
      handleConvertToAmountFromGrams(e);
    }
  };


  const handleReconcilePortfolio = async () => {
    if (!userDetails?.user?.phone_number) return;

    setReconcileLoading(true);

    try {
      const res = await fetch("/api/reconcile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone_number: userDetails.user.phone_number,
        }),
      });

      const data = await res.json();


      if (data?.success) {
        setIsReconciled(true);
        toast({
          title: "Success",
          description: "Portfolio reconciled successfully",
          variant: "success",
        });

        fetchUserDetails();
      } else {
        toast({
          title: "Error",
          description: data?.message || "Reconciliation failed",
        });
      }
    } catch (e) {
      toast({
        title: "Error",
        description: "Something went wrong",
      });
    } finally {
      setReconcileLoading(false);
    }
  };


  const options = [
    { label: "Deposit in Amount (₹)", value: "amt" },
    { label: "Deposit in Grams (gms)", value: "qty" },
  ];

  const handleDeposit = async (e) => {
    e.preventDefault();

    const numericAmount = Number(amount);
    const numericGrams = Number(grams);

    if (
      (depositType === "amt" && (!numericAmount || numericAmount <= 0)) ||
      (depositType === "qty" && (!numericGrams || numericGrams <= 0))
    ) {
      toast({
        title: "Error",
        description: "Please enter a valid deposit value",
      });
      return;
    }

    if ((depositDate && !depositTime) || (!depositDate && depositTime)) {
      toast({
        title: "Error",
        description: "Both deposit date and deposit time are required",
      });
      return;
    }

    if (!userDetails?.user?.phone_number && !amount) return;
    setDepositLoading(true);
    try {
      let params = {
        phone,
        txn_type: "BUY",
        reason: notes,
        metal_type: "silver",
        deposit_type: depositType,
      };

      if (depositType === "amt") {
        params.deposit_value = numericAmount;
      }

      if (depositType === "qty") {
        params.deposit_value = numericGrams;
      }

      if (silverPrice) {
        params.price = Number(silverPrice);
      }
      if (depositDate && depositTime) {
        const [year, month, day] = depositDate.split("-");
        params.created_at = `${day}-${month}-${year} ${depositTime}:00`;
      }
      const res = await fetch("/api/deposit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (data?.success) {
        // fetchUserDetails();
        setIsDepositSuccess(true);
        setIsReconciled(false);
        resetDepositForm();
        toast({
          title: "Success",
          description: data?.message + " " + "Reconcile and check your portfolio",
          variant: "success",
        });
      } else {
        toast({
          title: "Error",
          description: data?.message || "Something went wrong",
        });
      }
    } catch (e) {
      toast({
        title: "Error",
        description: "Something went wrong",
      });
    } finally {
      setDepositLoading(false);
    }
  };

  const getUserFullName = () => {
    if (!userDetails) return "";
    return `${userDetails.user.first_name} ${userDetails?.user?.middle_name || ""} ${userDetails.user.last_name}`.trim();
  };

  return (
    <div className="min-h-screen p-6">
      <div className="">
        <PageHeader
          title="Deposit Silver"
          subtitle="Search for a user and deposit silver into their account."
        />

        {/* Search Section */}
        <div className="mb-8 max-w-4xl mx-auto">
          <UpiUserSearch
            input={phone}
            setInput={setPhone}
            handleSubmit={fetchUserDetails}
            placeholder="Enter phone number"
            loading={searchLoading}
          />
        </div>

        {userDetails && !searchLoading && (
          <div className="space-y-6">


            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">


              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Full Name</p>
                    <p className="text-lg font-semibold text-gray-900">{getUserFullName()}</p>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Phone Number</p>
                    <p className="text-lg font-semibold text-gray-900 font-mono">{userDetails.user.phone_number}</p>
                  </div>
                </div>


                <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 border-2 border-slate-300 rounded-xl p-6 shadow-inner">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-slate-400/10 rounded-full -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gray-400/10 rounded-full -ml-12 -mb-12"></div>

                  <div className="relative flex items-center gap-4">
                    <div className="p-4 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl shadow-lg">
                      <Star className="h-7 w-7 text-white fill-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-1">Available Silver Balance</p>
                      <p className="text-4xl font-bold bg-gradient-to-r from-slate-700 to-gray-700 bg-clip-text text-transparent">
                        {userDetails?.wallets?.[1]?.qty_g || 0} <span className="text-2xl">gms</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            {/* Deposit Details Card */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">

              <div className="p-6 space-y-6">
                {/* Toggle Buttons */}
                <div className="flex justify-center">
                  <div className="inline-flex rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 p-1 shadow-inner">
                    {options.map((item) => {
                      const isActive = depositType === item.value;
                      return (
                        <button
                          key={item.value}
                          onClick={() => setDepositType(item.value)}
                          className={`
                            px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-200
                            ${isActive
                              ? "bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-md transform scale-105"
                              : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                            }
                          `}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Input Fields */}
                {depositType === "amt" ? (
                  <InputField
                    label="Deposit Amount (₹)(Required)"
                    value={amount}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "" || /^\d*\.?\d{0,2}$/.test(val)) {
                        setAmount(val);
                        setGrams("");
                      }
                    }}
                    placeholder="Enter amount in rupees"
                    icon={Star}
                  />
                ) : (
                  <InputField
                    label="Deposit Grams (gms)(Required)"
                    value={grams}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "" || /^\d*\.?\d{0,4}$/.test(val)) {
                        setGrams(val);
                        setAmount("");
                      }
                    }}
                    placeholder="Enter grams"
                    icon={Star}
                  />
                )}

                {/* Convert Button */}


                <div className="flex justify-end">
                  <button
                    onClick={handleReconcilePortfolio}
                    disabled={reconcileLoading || !isDepositSuccess || isReconciled}
                    className={`
    px-8 py-3 rounded-full font-semibold transition-all
    ${reconcileLoading || !isDepositSuccess || isReconciled
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-slate-600 text-white hover:bg-slate-700"}
  `}
                  >
                    {reconcileLoading
                      ? "Reconciling..."
                      : isReconciled
                        ? "Portfolio Reconciled"
                        : "Reconcile Portfolio"}
                  </button>


                </div>

                <div className="flex justify-center py-2">
                  <button
                    onClick={handleConvert}
                    disabled={convertLoading || (depositType === "amt" ? !amount : !grams)}
                    className="group relative bg-gradient-to-r from-slate-600 to-slate-700 text-white px-10 py-4 rounded-full font-semibold hover:from-slate-700 hover:to-slate-800 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center gap-3 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    {convertLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Converting...</span>
                      </>
                    ) : (
                      <>
                        <ArrowDown className="h-5 w-5 group-hover:translate-y-1 transition-transform" />
                        <span>{depositType === "amt" ? "Convert to Grams" : "Convert to Amount"}</span>
                      </>
                    )}
                  </button>
                </div>

                {depositType === "amt" ? (
                  <InputField label="Equivalent Grams (gms)" value={grams} disabled />
                ) : (
                  <InputField label="Equivalent Amount (₹)" value={amount} disabled />
                )}

                {/* Additional Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputField
                    label="Silver Price (₹/g)"
                    value={silverPrice}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "" || /^\d*\.?\d{0,2}$/.test(val)) {
                        setSilverPrice(val);
                        setErrors({ ...errors, silverPrice: undefined });
                      }
                    }}
                    placeholder="Enter price"
                    error={errors.silverPrice}
                  />

                  <InputField
                    label="Deposit Date"
                    type="date"
                    value={depositDate}
                    onChange={(e) => setDepositDate(e.target.value)}
                    icon={Calendar}
                  />

                  <InputField
                    label="Deposit Time"
                    type="time"
                    step="1"
                    value={depositTime}
                    onChange={(e) => setDepositTime(e.target.value)}
                    icon={Clock}
                  />
                </div>

                <TextAreaField
                  label="Deposit Notes (Required)"
                  value={notes}
                  onChange={(e) => {
                    setNotes(e.target.value);
                    setErrors({ ...errors, notes: undefined });
                  }}
                  placeholder="Enter reason for deposit..."
                  error={errors.notes}
                />

                {/* Deposit Button */}
                <div className="flex justify-end pt-4 ">
                  <button
                    onClick={handleDeposit}
                    disabled={depositLoading || !amount || !grams || !notes}
                    className="group relative bg-gradient-to-r from-slate-600 to-slate-700 text-white px-10 py-4 rounded-full font-semibold hover:from-slate-700 hover:to-slate-800 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center gap-3 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    {depositLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Processing Deposit...</span>
                      </>
                    ) : (
                      <>
                        <ArrowDown className="h-5 w-5" />
                        <span>Deposit Silver</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!userDetails && !searchLoading && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-20 text-center">
            <div className="inline-block p-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-6 shadow-inner">
              <Search className="h-16 w-16 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">No User Selected</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Search for a user by phone number to begin the deposit process
            </p>
          </div>
        )}

        {/* Loading State */}
        {searchLoading && <UserProfileSkeleton />}
      </div>
    </div>
  );
}