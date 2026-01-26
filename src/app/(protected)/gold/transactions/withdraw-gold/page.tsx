"use client";
import React, { useState } from "react";
import { Search, Loader2, User, ArrowDown, Coins, AlertCircle, CheckCircle2, Calculator, Star, ArrowUp } from "lucide-react";
import { UpiUserSearch } from "../../../../../components/upiUserSearch";
import { useToast } from "../../../../../context/toast.context";
import InputField from "../../../../../components/ui/InputField";
import TextAreaField from "../../../../../components/ui/TextAreaField";
import UserProfileSkeleton from "../../../../../components/UserProfile/UserProfileSkeleton";
import { PageHeader } from "../../../../../components/dashboard/PageHeader";

interface UserDetails {
  user: {
    _id: string;
    first_name: string;
    last_name: string;
    middle_name: string;
    phone_number: string;
    isKycVerified: string;
  };
  gold_balance: string;
  wallets: {
    qty_g: number;
  }[];
}




export default function GoldWithdrawalPage() {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [convertLoading, setConvertLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [grams, setGrams] = useState("");
  const [notes, setNotes] = useState("");
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [errors, setErrors] = useState<any>({});
  const { toast } = useToast()

  const [isWithdrawSuccess, setIsWithdrawSuccess] = useState(false);
  const [isReconciled, setIsReconciled] = useState(false);
  const [reconcileLoading, setReconcileLoading] = useState(false);



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
        handleSearch();
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



  const handleSearch = async (e: React.FormEvent | null = null) => {
    e?.preventDefault();

    if (!phone || phone.length !== 10) {
      toast({
        title: "Error",
        description: "Phone number is required and must be 10 digits",
      });
      return;
    }
    try {
      setSearchLoading(true);
      const res = await fetch(`/api/user/${phone}?type=profile`);
      const data = await res.json();

      if (data?.success) {
        setUserDetails(data.data);
      }
    } catch {
      toast({ title: "Error", description: "Something went wrong" });
    } finally {
      setSearchLoading(false);
    }
  };
  const handleConvert = async (e: React.FormEvent) => {
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
  };
  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userDetails?.user?.phone_number || !grams) {
      toast({
        title: "Error",
        description: "Phone number and grams are required",
      });
      return;
    }

    if (userDetails?.wallets[0].qty_g < grams) {
      toast({
        title: "Error",
        description: "Insufficient balance",
      });
      return;
    }


    setWithdrawLoading(true);

    try {
      const params = {
        phone: phone,
        qty_to_debit: grams,
        reason: notes,
        metal_type: "GOLD24",
      };

      const res = await fetch("/api/withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
      console.log(res, "CONSOLEEEE");
      const data = await res.json();

      if (data?.success) {
        setIsWithdrawSuccess(true)
        setIsReconciled(false);
        setGrams("");
        setAmount("");
        setNotes("");
        toast({
          title: "Success",
          description: data?.message,
          variant: "success",
        });
      } else {
        toast({
          title: "Error",
          description: data?.message || "Something went wrong",
        });
      }
    } catch (error) {
      console.error("Error withdrawing gold:", error);
      toast({
        title: "Error",
        description: "Something went wrong",
      });
    } finally {
      setWithdrawLoading(false);
    }
  };


  const formatCurrency = (value: string) => {
    if (!value) return "";
    return parseFloat(value).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });
  };

  const getUserFullName = () => {
    if (!userDetails) return "";
    return `${userDetails.user.first_name} ${userDetails?.user?.middle_name} ${userDetails.user.last_name}`.trim();
  };

  return (
    <div className="min-h-screen p-6">
      <PageHeader
        title="Withdraw Gold"
        subtitle="Search for a user and withdraw gold from their account."
      />
      <div className="">


        <div className="max-w-4xl mx-auto ">


          <UpiUserSearch
            input={phone}
            setInput={setPhone}
            handleSubmit={handleSearch}
            placeholder="Enter phone number"
            loading={searchLoading}
            helperText="Enter 10-digit phone number"
          />
        </div>


        {userDetails && !searchLoading && (
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
        )}

        {userDetails && !searchLoading && (
          <div className="bg-white border my-4 border-gray-200 rounded-md shadow-sm p-6">

            <div className="flex justify-end mt-4">
              <button
                onClick={handleReconcilePortfolio}
                disabled={reconcileLoading || !isWithdrawSuccess || isReconciled}
                className={`
      px-8 py-3 rounded-full font-semibold transition-all
      ${reconcileLoading || !isWithdrawSuccess || isReconciled
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


            <div className="space-y-6">
              <InputField
                label="Withdraw Gold (in grams) (Required)"
                value={grams}
                onChange={(e: any) => {
                  const val = e.target.value;
                  if (val === "" || /^\d*\.?\d{0,4}$/.test(val)) {
                    setGrams(val);
                    setErrors({ ...errors, grams: undefined });
                  }
                }}
                placeholder="Enter quantity in grams"
                icon={Star}
                error={errors.grams}
              />

              <div className="flex justify-center">
                <button
                  onClick={handleConvert}
                  disabled={convertLoading || !grams}
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
                      Convert to Rupees
                    </>
                  )}
                </button>


              </div>

              {/* Amount Display */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Equivalent Amount</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <span className="text-gray-500 font-medium">₹</span>
                  </div>
                  <input
                    type="text"
                    value={formatCurrency(amount)}
                    disabled
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 font-semibold text-lg disabled:opacity-100"
                  />
                </div>
              </div>


              <TextAreaField
                label="Withdrawal Notes (Required)"
                value={notes}
                onChange={(e: any) => {
                  setNotes(e.target.value);
                  setErrors({ ...errors, notes: undefined });
                }}
                placeholder="Enter reason for withdrawal (required)"
                error={errors.notes}
              />



              <div className="flex justify-end">
                <button
                  onClick={handleWithdraw}
                  disabled={withdrawLoading || !grams || !notes || !amount}
                  className="group relative bg-amber-500 text-white px-10 py-3 text-md rounded-full  hover:from-slate-700 hover:to-slate-800 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center gap-3 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

                  {withdrawLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Processing Withdrawal...
                    </>
                  ) : (
                    <>
                      <ArrowUp className="h-5 w-5" />
                      Withdraw Gold
                    </>
                  )}
                </button>
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
            <p className="text-gray-500">Search for a user by phone number to begin withdrawal process</p>
          </div>
        )}


        {searchLoading && (
          <UserProfileSkeleton />
        )}
      </div>
    </div>
  );
}