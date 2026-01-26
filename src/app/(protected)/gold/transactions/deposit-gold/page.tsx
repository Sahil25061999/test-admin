"use client";
import React, { useState } from "react";
import { UpiUserSearch } from "../../../../../components/upiUserSearch";
import { useToast } from "../../../../../context/toast.context";
import { ArrowDownIcon, Bars2Icon } from "@heroicons/react/24/outline";
import { PageHeader } from "../../../../../components/dashboard/PageHeader";
import { ArrowDown, ArrowRight, Calendar, Clock, Loader2, Search, Star } from "lucide-react";
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
  gold_balance: string;
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
  const [goldPrice, setGoldPrice] = useState("")
  const [depositFormat, setDepositFormat] = useState("Grams");
  const [notes, setNotes] = useState("")
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [searchLoading, setSearchLoading] = useState(false)
  const [depositDate, setDepositDate] = useState("")
  const [depositTime, setDepositTime] = useState("")
  const { toast } = useToast();
  const [errors, setErrors] = useState<any>({});
  const apiInstance = useAuthAxios()
  const [depositType, setDepositType] = useState("amt")
  const [isDepositSuccess, setIsDepositSuccess] = useState(false);
  const [isReconciled, setIsReconciled] = useState(false);
  const [reconcileLoading, setReconcileLoading] = useState(false);


  const fetchUserDetails = async (e = null) => {
    e?.preventDefault();
    if (!phone || phone.length !== 10) {
      toast({
        title: "Error",
        description: "Phone number is required and must be 10 digits",
      });
      return;
    }
    setSearchLoading(true)
    try {
      const res = await fetch(`/api/user/${phone}?type=profile`);
      const data = await res.json();
      if (data?.success) {
        setUserDetails(data.data);
        resetDepositForm()

      }
    } catch (e) {
      toast({
        title: "Error",
        description: "Something went wrong",
      });
    } finally {
      setSearchLoading(false)
    }
  };



  const handleReconcilePortfolio = async () => {
    if (!userDetails?.user?.phone_number) return;

    setReconcileLoading(true);
    try {
      const res = await fetch("/api/reconcile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    } finally {
      setReconcileLoading(false);
    }
  };



  const resetDepositForm = () => {
    setAmount("");
    setGrams("");
    setNotes("");
    setErrors({});
    setDepositDate("")
    setDepositTime("")
    setConvertLoading(false);
    setDepositLoading(false);
    setGoldPrice("")
  };

  const handleConvertToGramsFromAmount = async (e) => {
    e.preventDefault();
    let token: string;
    setConvertLoading(true);
    try {
      let block_id = 0;
      const block_id_res = await apiInstance.get("data/v1/prices?product=24KGOLD");
      if (block_id_res && block_id_res.data.success) {
        block_id = block_id_res.data.data.id;
      }
      // console.log(block_id_res);
      const res = await apiInstance.get(
        `data/v1/convert?block_id=${block_id}&price_type=buy&input_val=${amount}&input_type=amt&product_type=GOLD`
      );
      if (res?.data?.success) {
        // console.log(res.data.data);
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
      const params1 = { action: "prices", product: "24KGOLD" };
      const searchParams1 = new URLSearchParams(params1);
      const block_id_res = await fetch(`/api/data?${searchParams1.toString()}`);
      const block_data = await block_id_res.json();

      if (block_data?.success) {
        block_id = block_data.data.id;
      }

      const params2 = {
        action: "convert",
        block_id: block_id.toString(),
        price_type: "sell",
        input_val: grams,
        input_type: "qty",
      };
      const searchParams2 = new URLSearchParams(params2);
      const res = await fetch(`/api/data?${searchParams2.toString()}`);
      const data = await res.json();

      console.log(data?.data, "HELLLOOOOOO")

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
  }

  const handleConvert = (e: React.FormEvent) => {
    if (depositType === "amt") {
      handleConvertToGramsFromAmount(e);
    } else {
      handleConvertToAmountFromGrams(e);
    }
  };

  const options = [
    { label: "Deposit in Amount (₹)", value: "amt" },
    { label: "Deposit in Grams (gms)", value: "qty" },
  ];


  const handleDeposit = async (e) => {
    e.preventDefault();


    if (!phone) {
      toast({
        title: "Error",
        description: "Phone number is required",
      });
      return;
    }

    const numericAmount = Number(amount);
    const numericGrams = Number(grams);

    if (
      (depositType === "amt" && (!numericAmount || numericAmount <= 0)) ||
      (depositType === "gms" && (!numericGrams || numericGrams <= 0))
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


    setDepositLoading(true);
    try {
      let params = {
        phone,
        txn_type: 'BUY',
        reason: notes,
        metal_type: 'gold',
        deposit_type: depositType,
      };

      if (depositType === "amt") {
        params.deposit_value = numericAmount;
      }

      if (depositType === "qty") {
        params.deposit_value = numericGrams;
      }

      if (goldPrice) {
        params.price = Number(goldPrice)
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
        setIsDepositSuccess(true);
        setIsReconciled(false);
        resetDepositForm();


        toast({
          title: "Success",
          description: data?.message + " " + "Reconcile it to confirm the transaction",
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
    return `${userDetails.user.first_name} ${userDetails.user.last_name}`.trim();
  };




  return (
    <div className="min-h-screen p-6">
      <div className="">

        <PageHeader
          title="Deposit Gold"
          subtitle="Search for a user and deposit gold into their account."
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


                <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 border-2 border-amber-300 rounded-xl p-6 shadow-inner">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-400/10 rounded-full -ml-12 -mb-12"></div>

                  <div className="relative flex items-center gap-4">
                    <div className="p-4 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl shadow-lg">
                      <Star className="h-7 w-7 text-white fill-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-amber-800 uppercase tracking-wide mb-1">Available Gold Balance</p>
                      <p className="text-4xl font-bold bg-gradient-to-r from-amber-700 to-yellow-700 bg-clip-text text-transparent">
                        {userDetails?.wallets?.[0]?.qty_g || 0} <span className="text-2xl">gms</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleReconcilePortfolio}
                disabled={reconcileLoading || !isDepositSuccess || isReconciled}
                className={`
      px-8 py-3 rounded-full font-semibold transition-all
      ${reconcileLoading || !isDepositSuccess || isReconciled
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-amber-500 text-white hover:bg-amber-600"}
    `}
              >
                {reconcileLoading
                  ? "Reconciling..."
                  : isReconciled
                    ? "Portfolio Reconciled"
                    : "Reconcile Portfolio"}
              </button>
            </div>


            <div className="rounded-md border border-gray-200 bg-white overflow-hidden p-6">
              <div className="flex justify-center">
                <div className="inline-flex bg-gradient-to-br rounded-md from-gray-100 to-gray-200 p-1 ">
                  {options.map((item) => {
                    const isActive = depositType === item.value;
                    return (
                      <button
                        key={item.value}
                        onClick={() => setDepositType(item.value)}
                        className={`
                            px-6 py-3 text-sm  rounded-md  transition-all duration-200
                            ${isActive
                            ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-md transform scale-105"
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



              <div className="space-y-6">
                {depositType === "amt" ? (
                  <InputField
                    label="Deposit Amount (₹)(Required)"
                    value={amount}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "" || /^\d*\.?\d{0,2}$/.test(val)) {
                        setAmount(val);
                        setGrams("")
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


                <div className="flex justify-center py-2">
                  <button
                    onClick={handleConvert}
                    disabled={
                      convertLoading ||
                      (depositType === "amt" ? !amount : !grams)
                    }
                    className="group relative bg-amber-500 text-white px-10 py-3 text-md rounded-full  hover:from-slate-700 hover:to-slate-800 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center gap-3 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

                    {convertLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Converting...
                      </>
                    ) : (
                      <>
                        <ArrowDown className="h-5 w-5" />
                        {depositType === "amt"
                          ? "Convert to Grams"
                          : "Convert to Amount"}
                      </>
                    )}
                  </button>
                </div>


                {depositType === "amt" ? (
                  <InputField
                    label="Equivalent Grams (gms)"
                    value={grams}
                    disabled
                  />
                ) : (
                  <InputField
                    label="Equivalent Amount (₹)"
                    value={amount}
                    disabled
                  />
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputField
                    label="Gold Price (₹/g)"
                    value={goldPrice}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "" || /^\d*\.?\d{0,2}$/.test(val)) {
                        setGoldPrice(val);
                        setErrors({ ...errors, goldPrice: undefined });
                      }
                    }}
                    placeholder="Enter price"
                    error={errors.goldPrice}
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

                <div className="flex justify-end">
                  <button
                    onClick={handleDeposit}
                    disabled={depositLoading || !amount || !grams || !notes}
                    className="group relative bg-amber-500 text-white px-10 py-3 text-md rounded-full  hover:from-slate-700 hover:to-slate-800 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center gap-3 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    {depositLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Processing Deposit...
                      </>
                    ) : (
                      <>
                        <ArrowDown className="h-5 w-5" />
                        Deposit Gold
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}


        {!userDetails && !searchLoading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-16 text-center">
            <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No User Selected</h3>
            <p className="text-gray-500">Search for a user by phone number to begin deposit process</p>
          </div>
        )}


        {searchLoading && <UserProfileSkeleton />}
      </div>
    </div>
  );
}
