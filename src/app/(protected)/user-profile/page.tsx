"use client";
import React, { useEffect, useState } from "react";
import { Search, Loader2, User, CreditCard, MapPin, Wallet, FileText, ChevronDown, ChevronUp, Star, Edit2, X, Check, Users } from "lucide-react";
import { useToast } from "../../../context/toast.context";
import { UpiUserSearch } from "../../../components/upiUserSearch";
import { type } from "os";
import { STATES } from "../../../constants/states";
import UserProfileSkeleton from "../../../components/UserProfile/UserProfileSkeleton";
import { PageHeader } from "../../../components/dashboard/PageHeader";
import { useAppContext } from "../../../context/app";
import Sidebar from "../../../components/ui/Sidebar";
import AddBankAccount from "../../../components/bank/AddBankAccount";
import AddInWallet from "../../../components/AddInWallet";




type ValidationRule = {
  required?: boolean | string;
  pattern?: {
    value: RegExp;
    message: string;
  };
  minLength?: {
    value: number;
    message: string;
  };
  maxLength?: {
    value: number;
    message: string;
  };
};

interface UserData {
  user: {
    id: number;
    first_name: string;
    middle_name: string;
    last_name: string;
    phone_number: string;
    email: string;
    state: string;
    dob: string;
    kyc_verified: boolean;
    referral_code: string;
    created_at: string;
  };
  kyc_details: {
    pan_number: string;
    aadhaar_number: string;
    is_pan_verified: boolean;
    is_aadhaar_verified: boolean;
    kyc_verified_on: string;
  };
  banks: Array<{
    id: number;
    bank_name: string;
    account_number: string;
    ifsc_code: string;
    account_type: string;
    account_holder_name: string;
  }>;
  addresses: Array<{
    id: number;
    name: string;
    phone_number: string;
    street_address: string;
    street_address2: string;
    city: string;
    state: string;
    pincode: string;
  }>;
  subscriptions: Array<{
    id: number;
    subscription_id: string;
    plan_name: string;
    plan_amount: number;
    status: string;
    start_date: string;
  }>;
  wallets: Array<{
    id: number;
    product_name: string;
    qty_g: number;
  }>;
  fiat_wallet: {
    id: number;
    balance: number;
    is_active: boolean;
  };
  nominee: {
    id: number;
    first_name: string;
    last_name: string;
    phone_number: string;
    relationship: string;


  };
}

type InfoRowProps = {
  label: string;
  value: any;
  name: string;
  mono?: boolean;
  isEditing?: boolean;
  type?: string;
  options?: { label: string; value: string }[];
  rules?: ValidationRule;
  onChange?: (e: any) => void; onError?: (name: string, error: string) => void;
  errorText?: string
};

const Section = ({
  title,
  icon: Icon,
  children,
  onEdit,
  isEditing,
  onSave,
  onCancel,
  loading,
  userProfileHasErrors,
}: any) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">

      <div className="flex items-center justify-between px-6 py-4 bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />
          </div>

          <h2 className="text-sm font-semibold text-gray-900 tracking-wide">
            {title}
          </h2>
        </div>


        <div className="flex items-center gap-2">
          {onEdit && !isEditing && (
            <button
              onClick={onEdit}
              className="inline-flex items-center gap-1.5
                rounded-lg border border-gray-300
                bg-white px-3 py-1.5
                text-sm font-medium text-gray-700
                hover:bg-gray-100 hover:text-gray-900
                transition"
            >
              Edit
            </button>
          )}

          {isEditing && (
            <>
              <button
                onClick={onSave}
                disabled={loading || userProfileHasErrors}
                className="inline-flex items-center justify-center
                  rounded-lg bg-primary px-4 py-1.5
                  text-sm font-medium text-white
                  hover:bg-primary/90
                  transition
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving…" : "Save"}
              </button>

              <button
                onClick={onCancel}
                disabled={loading}
                className="inline-flex items-center
                  rounded-lg border border-gray-300
                  bg-white px-3 py-1.5
                  text-sm font-medium text-gray-700
                  hover:bg-gray-100
                  transition
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>


      <div className="px-6 py-5 bg-white">
        {children}
      </div>
    </div>
  );
};



const InfoRow = ({
  label,
  value,
  mono = false,
  isEditing = false,
  onChange,
  name,
  type = "text",
  options,
  rules, onError, errorText
}: InfoRowProps) => {

  const [error, setError] = React.useState("");

  const validate = (val: string) => {
    if (rules?.required && !val) {
      return typeof rules.required === "string"
        ? rules.required
        : "This field is required";
    }

    if (rules?.pattern && !rules.pattern.value.test(val)) {
      return rules.pattern.message;
    }

    if (rules?.minLength && val.length < rules.minLength.value) {
      return rules.minLength.message;
    }

    if (rules?.maxLength && val.length > rules.maxLength.value) {
      return rules.maxLength.message;
    }

    return "";
  };




  const handleChange = (e: any) => {
    const val = e.target.value;
    const validationError = validate(val);
    setError(validationError);
    onError?.(name, validationError);
    onChange?.(e);
  };





  console.log(options, "OPTIONS", value)
  return (
    <div className="flex flex-col gap-1 py-3 border-b border-gray-100 last:border-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <span className="text-sm font-medium text-gray-500">{label}</span>

        {isEditing ? (
          options ? (
            <select
              name={name}
              value={value || ""}
              onChange={handleChange}
              className={`
                sm:max-w-xs w-full px-3 py-2 text-sm rounded-lg
                border ${error ? "border-red-400" : "border-gray-300"}
                focus:outline-none focus:ring-2
                ${error ? "focus:ring-red-400" : "focus:ring-indigo-500"}
              `}
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              name={name}
              value={value || ""}
              onChange={handleChange}
              className={`
                sm:max-w-xs w-full px-3 py-2 text-sm rounded-lg
                border ${error ? "border-red-400" : "border-gray-300"}
                bg-white text-gray-900
                ${mono ? "font-mono" : ""}
                focus:outline-none focus:ring-2
                ${error ? "focus:ring-red-400" : "focus:ring-indigo-500"}
              `}
            />
          )
        ) : (
          <span
            className={`text-sm text-gray-900 sm:text-right break-all ${mono ? "font-mono" : ""
              }`}
          >
            {value || <span className="text-gray-400">—</span>}
          </span>
        )}
      </div>


      {errorText && (
        <span className="text-xs text-red-500 ml-auto sm:max-w-xs">
          {errorText}
        </span>
      )}
    </div>
  );
};


const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    ACTIVE: "bg-emerald-100 text-emerald-700",
    SUCCESS: "bg-emerald-100 text-emerald-700",
    PAUSED: "bg-amber-100 text-amber-700",
    CANCELLED: "bg-red-100 text-red-700",
    FAILED: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1
      text-xs font-semibold rounded-full
      ${colors[status] || "bg-gray-100 text-gray-700"}`}
    >
      {status}
    </span>
  );
};


type FilterTab = {
  label: string;
  value: string;
};

type FilterGroupProps = {
  title: string;
  tabs: FilterTab[];
  value: string;
  onChange: (val: string) => void;
};

const FilterGroup = ({ title, tabs, value, onChange }: FilterGroupProps) => {
  return (
    <div className="flex flex-col mb-2 gap-2">
      <span className="text-xs font-medium text-slate-500 uppercase">
        {title}
      </span>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const isActive = value === tab.value;

          return (
            <button
              key={tab.value}
              onClick={() => onChange(tab.value)}
              className={`
                px-4 py-2 rounded-md text-sm
                transition-all duration-200
                focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40
                ${isActive
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100"
                }
              `}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};


export default function UserProfileViewer() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast()
  const [searchLoading, setSearchLoading] = useState(false)

  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditingUser, setIsEditingUser] = useState(false);

  const [saveLoading, setSaveLoading] = useState(false)

  const [userFormErrors, setUserFormErrors] = useState<Record<string, string>>({});
  const [editedUserData, setEditedUserData] = useState<any>(null);
  const [editedNomineeData, setEditedNomineeData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("GOLD")
  const [subStatus, setSubStatus] = useState("ACTIVE")
  const [mahaActiveTab, setMahaActiveTab] = useState("user_information")
  const [nomineeFormErrors, setNomineeFormErrors] = useState<Record<string, string>>({});
  const [isEditingNominee, setIsEditingNominee] = useState(false)
  const [isEditingKyc, setIsEditingKyc] = useState(false);
  const [editedUserKycData, setEditedUserKycData] = useState<any>(null);
  const [kycFormErrors, setKycFormErrors] = useState<Record<string, string>>({});
  const [allTransactions, setAllTransactions] = useState<any>([]);
  const [allTransactionsLoading, setAllTransactionsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState("BUY")
  const [selectedStatus, setSelectedStatus] = useState("SUCCESS")
  const [selectedSubTxnType, setSelectedSubTxnType] = useState("SAVINGS")
  const [selectedProduct, setSelectedProduct] = useState("GOLD24")
  const [selectedPage, setSelectedPage] = useState(1)
  const [totalTxns, setTotalTxns] = useState(0)
  const [txns, setTxns] = useState([])
  const [currentLimit, setCurrentLimit] = useState(10)


  const { setSidebarContent, setSidebarOpen, setSidebarTitle } = useAppContext()



  const TRANS_STATUS = [
    {
      label: "Success",
      value: "SUCCESS"
    },
    {
      label: "Cancelled",
      value: "CANCELLED"
    },
    {
      label: "Pending",
      value: "PENDING"
    },
    {
      label: "Processing",
      value: "PROCESSING"
    }
  ]


  const TRANS_PRODUCT = [
    {
      label: "Gold",
      value: "GOLD24"
    },
    {
      label: "Silver",
      value: "SILVER24"
    }
  ]

  const TRANS_TYPE = [
    {
      label: "Buy",
      value: "BUY"
    },
    {
      label: "Sell",
      value: "SELL"
    },
    {
      label: "Autopay",
      value: "AUTOPAY"
    }, {
      label: "Referral Reward",
      value: "REFERRAL_REWARD"
    }, {
      label: "Deposit",
      value: "DEPOSIT"
    },
    {
      label: "Reward",
      value: "REWARD"
    }
  ]


  const SUB_TXN_TYPE = [
    {
      label: "Savings",
      value: "SAVINGS"
    },
    {
      label: "Gold Redemption",
      value: "GOLD_REDEMPTION"
    }, {
      label: "Silver Redemption",
      value: "SILVER_REDEMPTION"
    }
  ]




  const MAHA_TABS = [
    {
      value: "user_information",
      label: "User Information"
    }, {
      value: "kyc_details",
      label: "KYC Details"
    }, {
      value: "bank_details",
      label: "Bank Details"
    }, {
      value: "addresses",
      label: "Addresses"
    }, {
      value: "nominee_details",
      label: "Nominee Details"
    }, {
      value: "active_subscriptions",
      label: "Active Subscriptions"
    }
  ]
  const TABS = [
    { label: "Gold", value: "GOLD" },
    { label: "Silver", value: "SILVER" },
  ];

  const statuses = [
    {
      name: "Active",
      value: "ACTIVE"
    }, {
      value: "CANCELLED",
      name: "Cancelled"
    }, {
      name: "Paused",
      value: "PAUSED"
    }
  ]


  const handleAddBankAccount = async () => {
    setSidebarOpen(true)
    setSidebarTitle("Add Bank Account")
    setSidebarContent(<AddBankAccount onSuccess={handleSearch} />)
  }


  const handleAddInWallet = async () => {
    setSidebarOpen(true)
    setSidebarTitle("Add In Wallet")
    setSidebarContent(<AddInWallet phone_number={phone} onSuccess={handleSearch} />)
  }


  const handleSearch = async (e?: React.FormEvent) => {
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
      const res = await fetch(`/api/profile?phone_number=${phone}`);
      const data = await res.json();
      console.log(data, "RES")


      if (data?.success) {
        setUserData(data.data);
      } else {
        toast({
          title: "Error",
          description: data?.message || "Something went wrong"
        })
        setUserData(null)
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast({
        title: "Error",
        description: "Something went wrong",
      });
    } finally {
      setSearchLoading(false);
    }
  };
  const formatDOBForInput = (dob?: string) => {
    if (!dob) return "";
    const [dd, mm, yyyy] = dob.split("-");
    return `${yyyy}-${mm}-${dd}`;
  };


  const formatDOBForOutput = (dob?: string) => {
    if (!dob) return "";
    const [yyyy, mm, dd] = dob.split("-");
    return `${dd}-${mm}-${yyyy}`;
  };

  const formatDOBForOutputKYC = (dob?: string) => {
    if (!dob) return "";
    const [yyyy, mm, dd] = dob.split("-");
    return `${dd}/${mm}/${yyyy}`;
  };
  const handleEditUser = () => {
    setIsEditingUser(true);
    setUserFormErrors({});
    const formattedDOB = formatDOBForInput(userData?.user?.dob);

    setEditedUserData({
      first_name: userData?.user?.first_name,

      last_name: userData?.user?.last_name,
      email: userData?.user?.email,
      phone_number: userData?.user?.phone_number,
      dob: formattedDOB,
      referral_code: userData?.user?.referral_code,
      state: userData?.user?.state,

    });
  };

  const handleCancelEdit = () => {
    setIsEditingUser(false);
    setEditedUserData(null);
  };


  const handleEditNominee = () => {
    setIsEditingNominee(true);
    setNomineeFormErrors({});

    console.log(userData?.nominee, "def")
    setEditedNomineeData({
      first_name: userData?.nominee?.first_name,
      last_name: userData?.nominee?.last_name,
      phone_number: userData?.nominee?.phone_number,
      relationship: userData?.nominee?.relationship,
    });
  };


  const userProfileHasErrors = Object.keys(userFormErrors).length > 0;



  console.log(userProfileHasErrors)

  const handleSaveUser = async () => {

    if (userProfileHasErrors) {
      toast({
        title: "Validation Error",
        description: "Please fix all highlighted fields before saving.",
      });
      return;
    }
    try {
      setSaveLoading(true)

      const date = formatDOBForOutput(editedUserData?.dob)
      const payload = {
        phone_number: phone,
        user_fields: { first_name: editedUserData?.first_name, last_name: editedUserData?.last_name, email: editedUserData?.email, phone_number: editedUserData?.phone_number, middle_name: editedUserData?.middle_name, dob: date, referral_code: editedUserData?.referral_code, state: editedUserData?.state }
      }
      console.log(payload, "PAYLOAD")

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      console.log(data)
      if (data?.success) {
        await handleSearch()
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

      setSaveLoading(false)
      setIsEditingUser(false);

    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Error",
        description: "Failed to update user information",
      });
    } finally {
      setSaveLoading(false)
    }
  };




  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUserData((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };




  const handleNomineeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedNomineeData((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };






  const handleFieldError = (field: string, error: string) => {
    setUserFormErrors((prev) => {
      const updated = { ...prev };

      if (!error) {
        delete updated[field];
      } else {
        updated[field] = error;
      }

      return updated;
    });
  };



  const handleNomineeFieldError = (field: string, error: string) => {
    setNomineeFormErrors((prev) => {
      const updated = { ...prev };

      if (!error) {
        delete updated[field];
      } else {
        updated[field] = error;
      }

      return updated;
    });
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };





  const handleSaveNominee = async () => {

    console.log(nomineeFormErrors, "oooo")

    if (Object.values(nomineeFormErrors).length > 0) {
      toast({
        title: "Validation Error",
        description: "Please fix all highlighted fields before saving.",
      });
      return;
    }
    try {
      setSaveLoading(true)

      const payload = {
        phone_number: phone,
        nominee: { first_name: editedNomineeData?.first_name, last_name: editedNomineeData?.last_name, phone_number: editedNomineeData?.phone_number, relationship: editedNomineeData?.relationship }
      }


      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      console.log(data)
      if (data?.success) {
        await handleSearch()
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

      setSaveLoading(false)
      setIsEditingNominee(false);

    } catch (error) {
      console.error("Error updating nominee:", error);
      toast({
        title: "Error",
        description: "Failed to update nominee information",
      });
    } finally {
      setSaveLoading(false)
    }
  };

  const handleCancelNomineeEdit = () => {
    setIsEditingNominee(false);
    setEditedNomineeData(null);
  };


  const handleKycInputChange = (e: React.ChangeEvent<HTMLInputElement>, type?: string) => {
    const { name, value, checked } = e.target;
    console.log(name, value, checked, "sameeee")
    setEditedUserKycData((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleKycFieldError = (field: string, error: string) => {
    setKycFormErrors((prev) => {
      const updated = { ...prev };
      if (!error) delete updated[field];
      else updated[field] = error;
      return updated;
    });
  };


  const handleSaveKyc = async () => {
    if (kycHasErrors) {
      toast({
        title: "Validation Error",
        description: "Please fix all highlighted fields before saving.",
      });
      return;
    }

    try {
      setSaveLoading(true);




      const date = formatDOBForOutputKYC(editedUserKycData?.pan_dob)
      const payload = {
        phone_number: phone,
        kyc: { pan_number: editedUserKycData?.pan_number, pan_dob: date, aadhaar_number: editedUserKycData?.aadhaar_number, is_pan_verified: editedUserKycData?.is_pan_verified, is_aadhaar_verified: editedUserKycData?.is_aadhaar_verified }
      }
      console.log(payload, "PAYLOAD")

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data?.success) {
        await handleSearch();
        toast({
          title: "Success",
          description: data?.message || "KYC updated successfully",
          variant: "success",
        });
        setIsEditingKyc(false);
      } else {
        toast({
          title: "Error",
          description: data?.message || "Failed to update KYC",
        });
      }
    } catch (error) {
      console.error("KYC update error:", error);
      toast({
        title: "Error",
        description: "Something went wrong while updating KYC",
      });
    } finally {
      setSaveLoading(false);
    }
  };


  const kycHasErrors = Object.keys(kycFormErrors).length > 0;



  const displayUserData = isEditingUser ? editedUserData : { ...userData?.user, last_name: userData?.user?.last_name };
  const displayUserKycData = isEditingUser ? editedUserKycData : { ...userData?.kyc_details };
  const displayNomineeData = isEditingNominee ? editedNomineeData : { first_name: userData?.nominee?.first_name, last_name: userData?.nominee?.last_name, phone_number: userData?.nominee?.phone_number, relationship: userData?.nominee?.relationship };
  console.log(editedNomineeData, "editedNomineeData")
  console.log(editedUserKycData, "editedUserKycData")


  useEffect(() => {
    if (!phone) return;

    const fetchTxns = async () => {
      setAllTransactionsLoading(true);
      try {
        const params = new URLSearchParams({
          phone_number: phone,
          txn_type: selectedType,
          txn_status: selectedStatus,
          offset: String((selectedPage - 1) * currentLimit),
          limit: String(currentLimit),
          product_name: selectedProduct,
          category: selectedSubTxnType,
        });

        const response = await fetch(`/api/all-transactions?${params.toString()}`, {
          method: "GET",
        });

        const data = await response.json();
        console.log(data, "SAAAA")
        if (data?.success) {
          if (selectedSubTxnType === "SAVINGS") {
            setTxns(data?.data?.transactions || [])
            setTotalTxns(data?.data?.counts?.total || 0)
          }
          else if (selectedSubTxnType === "GOLD_REDEMPTION") {
            setTxns(data?.data?.gold_redemptions || [])
            setTotalTxns(data?.data?.counts?.total || 0)
          }
          else if (selectedSubTxnType === "SILVER_REDEMPTION") {
            setTxns(data?.data?.silver_redemptions || [])
            setTotalTxns(data?.data?.counts?.total || 0)
          }
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setTxns([]);
        setTotalTxns(0);
      } finally {
        setAllTransactionsLoading(false);
      }
    };

    fetchTxns();
  }, [selectedStatus, selectedType, phone, selectedProduct, selectedSubTxnType, selectedPage]);

  // Reset page when filters change
  useEffect(() => {
    setSelectedPage(1);
  }, [selectedStatus, selectedType, selectedProduct, selectedSubTxnType]);

  console.log(selectedStatus, selectedType)
  return (
    <div className="min-h-screen p-6 ">
      <PageHeader
        title="User Profile"

        subtitle="Search and manage user profile information, wallet balances, and transaction history."
      />
      <div className=" py-8">
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

        {searchLoading && <UserProfileSkeleton />}
        {userData && !searchLoading && (
          <div className="space-y-4 max-w-4xl mx-auto" >

            <div className="flex w-full flex-wrap justify-center gap-4">
              {userData?.wallets
                .filter(w =>
                  ["gold", "silver"].some(m =>
                    w.product_name.toLowerCase().includes(m)
                  )
                )
                .map(wallet => {
                  const isGold = wallet.product_name.toLowerCase().includes("gold");
                  return (
                    <div
                      key={wallet.id}
                      className={`flex flex-1 w-full  items-center gap-3 rounded-md p-4 border
            ${isGold
                          ? "bg-gradient-to-br from-yellow-50 to-amber-100 border-amber-200"
                          : "bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200"
                        }`}
                    >
                      <div
                        className={`p-3 rounded-full ${isGold ? "bg-amber-500" : "bg-slate-600"
                          } text-white`}
                      >
                        <Star />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${isGold ? "text-amber-700" : "text-slate-600"}`}>
                          {wallet.product_name}
                        </p>
                        <p className="text-xl font-semibold text-gray-900">
                          {wallet.qty_g.toFixed(4)} gms
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>


            <div className="flex flex-wrap justify-center gap-4">
              {userData?.wallets
                .filter(w =>
                  !["gold", "silver"].some(m =>
                    w.product_name.toLowerCase().includes(m)
                  )
                )
                .map(wallet => (
                  <div
                    key={wallet.id}
                    className="flex items-center gap-3 rounded-md p-4 border bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200"
                  >
                    <div className="p-3 rounded-full bg-slate-600 text-white">
                      <Star />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">
                        {wallet.product_name}
                      </p>
                      <p className="text-xl font-semibold text-gray-900">
                        {wallet.qty_g.toFixed(4)} gms
                      </p>
                    </div>
                  </div>
                ))}
            </div>


            <div className="flex items-start justify-between bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-md p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-600 rounded-full">
                  <Wallet className="w-5 h-5 text-white" />

                </div>
                <div>
                  <p className="text-sm text-indigo-700 font-medium">Aura Wallet</p>
                  <p className="text-xl font-semibold text-indigo-900">
                    ₹{userData?.fiat_wallet?.balance.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${userData?.fiat_wallet.is_active
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                      }`}
                  >
                    {userData?.fiat_wallet?.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              <div>
                <button
                  onClick={handleAddInWallet}
                  className="text-xs px-4 py-2 rounded-md font-medium bg-primary text-white"
                >
                  Add Amount
                </button>
              </div>

            </div>
          </div>

        )}

        {userData && !searchLoading && (
          <div className="space-y-6 flex-wrap space-x-2">
            {MAHA_TABS.map((tab) => {
              const isActive = mahaActiveTab === tab.value;

              return (
                <button
                  key={tab.value}
                  onClick={() => setMahaActiveTab(tab.value)}
                  className={`
        relative px-6 py-2 rounded-md text-sm
        transition-all duration-300 ease-out
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40
        ${isActive
                      ? "bg-primary text-white shadow-md scale-[1.02]"
                      : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }
      `}
                >
                  {tab.label}
                </button>
              );
            })}

            {
              mahaActiveTab === "user_information" && (
                <Section
                  title="User Information"
                  icon={User}
                  onEdit={handleEditUser}
                  isEditing={isEditingUser}
                  onSave={handleSaveUser}
                  onCancel={handleCancelEdit}
                  loading={saveLoading}
                  disabled={userProfileHasErrors}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                    <InfoRow name="user_id" label="User ID" value={userData?.user?.id} mono />
                    <InfoRow
                      label="First Name"
                      value={displayUserData?.first_name}
                      isEditing={isEditingUser}
                      onChange={handleInputChange}
                      name="first_name"
                      onError={handleFieldError}
                      rules={{
                        required: true,
                        minLength: {
                          value: 2,
                          message: "Minimum 2 characters required",
                        },
                      }}

                    />

                    <InfoRow

                      label="Last Name"
                      value={displayUserData?.last_name}
                      isEditing={isEditingUser}
                      onChange={handleInputChange}
                      name="last_name"
                      onError={handleFieldError}
                      rules={{
                        required: true,
                        minLength: {
                          value: 2,
                          message: "Minimum 2 characters required",
                        },
                      }}
                    />
                    <InfoRow

                      label="Phone"
                      value={displayUserData?.phone_number}
                      mono
                      isEditing={isEditingUser}
                      onChange={handleInputChange}
                      name="phone_number"
                      onError={handleFieldError}
                      rules={{
                        required: "Phone is required",
                        minLength: {
                          value: 10,
                          message: "Phone number must be 10 digits",
                        },
                        maxLength: {
                          value: 10,
                          message: "Phone number must be 10 digits",
                        },
                      }}
                    />
                    <InfoRow

                      label="Email"
                      value={displayUserData?.email}
                      isEditing={isEditingUser}
                      onChange={handleInputChange}
                      onError={handleFieldError}
                      name="email"
                      type="email"
                      rules={{
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Invalid email address",
                        },
                      }}
                    />
                    <InfoRow

                      label="State"
                      value={displayUserData?.state}
                      isEditing={isEditingUser}
                      name="state"
                      options={STATES}
                      onChange={handleInputChange}
                      onError={handleFieldError}
                    />
                    <InfoRow

                      label="Date of Birth"
                      value={displayUserData?.dob}
                      isEditing={isEditingUser}
                      onChange={handleInputChange}
                      name="dob"
                      type="date"
                      onError={handleFieldError}

                    />
                    <InfoRow

                      label="Referral Code"
                      value={displayUserData?.referral_code}
                      mono
                      isEditing={isEditingUser}
                      onChange={handleInputChange}
                      name="referral_code"
                      onError={handleFieldError}
                    />
                    <InfoRow

                      name="kyc_status"
                      label="KYC Status" value={displayUserData?.kyc_verified ? "✓ Verified" : "✗ Not Verified"} />
                    <InfoRow

                      name="member_since"
                      label="Member Since" value={formatDate(displayUserData?.created_at)} />
                  </div>
                </Section>
              )
            }


            {
              mahaActiveTab === "kyc_details" && (
                <Section
                  title="KYC Details"
                  icon={FileText}
                  onEdit={() => {
                    setIsEditingKyc(true);
                    setKycFormErrors({});
                    setEditedUserKycData({
                      pan_dob: formatDOBForInput(userData?.kyc_details?.kyc_data?.data?.dob),
                      pan_number: userData?.kyc_details?.pan_number,
                      aadhaar_number: userData?.kyc_details?.aadhaar_number,
                      is_pan_verified: userData?.kyc_details?.is_pan_verified,
                      is_aadhaar_verified: userData?.kyc_details?.is_aadhaar_verified,
                    });
                  }}
                  isEditing={isEditingKyc}
                  onSave={handleSaveKyc}
                  onCancel={() => {
                    setIsEditingKyc(false);
                    setEditedUserKycData(null);
                  }}
                  loading={saveLoading}
                  userProfileHasErrors={kycHasErrors}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                    <InfoRow
                      name="pan_number"
                      label="PAN Number"
                      value={isEditingKyc ? editedUserKycData?.pan_number : userData.kyc_details?.pan_number}
                      mono
                      isEditing={isEditingKyc}
                      onChange={handleKycInputChange}
                      onError={handleKycFieldError}
                      errorText={kycFormErrors?.pan_number}

                    />

                    <InfoRow

                      label="PAN DOB"
                      value={isEditingKyc ? editedUserKycData?.pan_dob : userData?.kyc_details?.kyc_data?.data?.dob}
                      isEditing={isEditingKyc}
                      onChange={handleKycInputChange}
                      name="pan_dob"
                      type="date"
                      onError={handleKycFieldError}
                      errorText={kycFormErrors?.pan_dob}

                    />

                    {isEditingKyc ? (
                      <div className="flex flex-col gap-1 py-3 border-b border-gray-100">
                        <span className="text-sm font-medium text-gray-500">PAN Verified</span>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            name="is_pan_verified"
                            checked={editedUserKycData?.is_pan_verified || false}
                            onChange={(e) => handleKycInputChange(e, "checkbox")}
                            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary"
                          />
                          <span className="text-sm text-gray-900">
                            {editedUserKycData?.is_pan_verified ? "✓ Verified" : "Not Verified"}
                          </span>
                        </label>
                      </div>
                    ) : (
                      <InfoRow name="is_pan_verified" label="PAN Verified" value={userData.kyc_details?.is_pan_verified ? "✓ Yes" : "✗ No"} />
                    )}

                    <InfoRow
                      name="aadhaar_number"
                      label="Aadhaar Number"
                      value={isEditingKyc ? editedUserKycData?.aadhaar_number : userData.kyc_details?.aadhaar_number}
                      mono
                      isEditing={isEditingKyc}
                      onChange={handleKycInputChange}
                      onError={handleKycFieldError}
                      errorText={kycFormErrors?.aadhaar_number}
                      rules={{
                        required: "Aadhaar Number is required",
                        pattern: {
                          value: /^[0-9]{12}$/,
                          message: "Aadhaar must be exactly 12 digits",
                        },
                      }}
                    />

                    {isEditingKyc ? (
                      <div className="flex flex-col gap-1 py-3 border-b border-gray-100">
                        <span className="text-sm font-medium text-gray-500">Aadhaar Verified</span>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            name="is_aadhaar_verified"
                            checked={editedUserKycData?.is_aadhaar_verified || false}
                            onChange={(e) => handleKycInputChange(e, "checkbox")}
                            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary"
                          />
                          <span className="text-sm text-gray-900">
                            {editedUserKycData?.is_aadhaar_verified ? "✓ Verified" : "Not Verified"}
                          </span>
                        </label>
                      </div>
                    ) : (
                      <InfoRow name="is_aadhaar_verified" label="Aadhaar Verified" value={userData.kyc_details?.is_aadhaar_verified ? "✓ Yes" : "✗ No"} />
                    )}

                    <InfoRow name="kyc_verified_on" label="KYC Verified On" value={formatDate(userData.kyc_details?.kyc_verified_on)} />
                  </div>
                </Section>
              )
            }
            {
              mahaActiveTab === "bank_details" && (
                <Section title="Bank Accounts" icon={CreditCard} defaultOpen={false}>
                  <div className="flex justify-end mb-4">

                    <button className="inline-flex items-center justify-center
                  rounded-lg bg-primary px-4 py-1.5
                  text-sm font-medium text-white
                  hover:bg-primary/90
                  transition
                  disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleAddBankAccount}>
                      Add Bank Account
                    </button>
                  </div>
                  <div className="space-y-4">
                    {userData.banks.map((bank) => (
                      <div key={bank.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold text-gray-900">{bank.bank_name}</h3>
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{bank.account_type}</span>
                        </div>
                        <div className="space-y-2">
                          <InfoRow name="account_holder" label="Account Holder" value={bank.account_holder_name} />
                          <InfoRow name="account_number" label="Account Number" value={bank.account_number} mono />
                          <InfoRow name="ifsc_code" label="IFSC Code" value={bank.ifsc_code} mono />
                        </div>
                      </div>
                    ))}
                    {
                      userData?.banks.length === 0 && (
                        <div className="border border-gray-200 rounded-lg p-4">
                          <p className="text-sm text-gray-700">No bank accounts found</p>
                        </div>
                      )
                    }
                  </div>
                </Section>
              )
            }

            {
              mahaActiveTab === "addresses" && (
                <Section title="Saved Addresses" icon={MapPin} defaultOpen={false}>
                  <div className="space-y-4">
                    {userData.addresses.map((address) => (
                      <div key={address.id} className="border border-gray-200 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">{address.name}</h3>
                        <p className="text-sm text-gray-700 mb-2">
                          {address.street_address}, {address.street_address2}
                        </p>
                        <p className="text-sm text-gray-700">
                          {address.city}, {address.state} - {address.pincode}
                        </p>
                        <p className="text-xs text-gray-500 mt-2 font-mono">{address.phone_number}</p>
                      </div>
                    ))}
                    {userData?.addresses.length === 0 && (
                      <div className="border border-gray-200 rounded-lg p-4">
                        <p className="text-sm text-gray-700">No addresses found</p>
                      </div>
                    )}
                  </div>
                </Section>
              )
            }


            {
              mahaActiveTab === "nominee_details" && (
                <Section
                  title="Nominee Details"
                  icon={User}
                  onEdit={handleEditNominee}
                  isEditing={isEditingNominee}
                  onSave={handleSaveNominee}
                  onCancel={handleCancelNomineeEdit}
                  loading={saveLoading}
                  disabled={nomineeFormErrors}

                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                    <InfoRow rules={{
                      required: true,
                      minLength: {
                        value: 2,
                        message: "Minimum 2 characters required",
                      },
                    }} name="first_name" label="First Name" value={displayNomineeData?.first_name} isEditing={isEditingNominee} onChange={handleNomineeInputChange}
                      onError={handleNomineeFieldError} mono errorText={nomineeFormErrors?.first_name} />
                    <InfoRow rules={{
                      required: true,
                      minLength: {
                        value: 2,
                        message: "Minimum 2 characters required",
                      },
                    }} name="last_name" label="Last Name" value={displayNomineeData?.last_name} isEditing={isEditingNominee} mono onChange={handleNomineeInputChange} onError={handleNomineeFieldError} errorText={nomineeFormErrors?.last_name} />
                    <InfoRow rules={{
                      required: true,
                      minLength: {
                        value: 10,
                        message: "Minimum 10 characters required",
                      },
                    }} name="phone_number" label="Phone Number" value={displayNomineeData?.phone_number} isEditing={isEditingNominee} mono onChange={handleNomineeInputChange} onError={handleNomineeFieldError} errorText={nomineeFormErrors?.phone_number} />
                    <InfoRow rules={{
                      required: true,
                      minLength: {
                        value: 2,
                        message: "Minimum 2 characters required",
                      },
                    }} name="relationship" label="Relation" value={displayNomineeData?.relationship} isEditing={isEditingNominee} mono onChange={handleNomineeInputChange} onError={handleNomineeFieldError} errorText={nomineeFormErrors?.relationship} />
                  </div>
                </Section>
              )
            }


            {
              mahaActiveTab === "active_subscriptions" && (
                <Section
                  title="Active Subscriptions"
                  icon={FileText}
                  defaultOpen={false}
                >


                  <div className="flex items-center justify-center mb-6">
                    <div className="inline-flex gap-2 rounded-md bg-gray-100 p-1.5 shadow-sm">
                      {["GOLD", "SILVER"].map((tab) => {
                        const isActive = activeTab === tab;

                        return (
                          <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`
            px-8 py-1 rounded-md text-sm
            transition-all duration-300
            ${isActive
                                ? "bg-primary text-white shadow-sm"
                                : "text-gray-600 hover:bg-gray-200"
                              }
          `}
                          >
                            {tab}
                          </button>
                        );
                      })}
                    </div>
                  </div>


                  <div className="flex flex-wrap gap-3 mb-6">
                    {statuses.map((s) => {
                      const isActive = subStatus === s.value;

                      return (
                        <button
                          key={s.value}
                          onClick={() => setSubStatus(s.value)}
                          className={`
          px-4 py-2 rounded-md text-xs
          transition-all duration-200 border
          ${isActive
                              ? "bg-primary text-white border-primary shadow-sm"
                              : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                            }
        `}
                        >
                          {s.name}
                        </button>
                      );
                    })}
                  </div>


                  <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Sub ID</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Plan</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Start Date</th>
                        </tr>
                      </thead>

                      <tbody>
                        {userData.subscriptions
                          .filter(
                            (sub) =>
                              sub.plan_name.includes(activeTab) &&
                              sub.status === subStatus
                          )
                          .map((sub) => (
                            <tr
                              key={sub.id}
                              className="border-t border-gray-100 hover:bg-gray-50 transition"
                            >
                              <td className="py-3 px-4 font-mono text-xs text-gray-600">
                                {sub.subscription_id}
                              </td>
                              <td className="py-3 px-4 font-medium">
                                {sub.plan_name}
                              </td>
                              <td className="py-3 px-4 font-semibold">
                                ₹{sub.plan_amount.toLocaleString("en-IN")}
                              </td>
                              <td className="py-3 px-4">
                                <StatusBadge status={sub.status} />
                              </td>
                              <td className="py-3 px-4 text-gray-600">
                                {formatDate(sub.start_date)}
                              </td>
                            </tr>
                          ))}

                        {userData.subscriptions.filter(
                          (sub) =>
                            sub.plan_name.includes(activeTab) &&
                            sub.status === subStatus
                        ).length === 0 && (
                            <tr>
                              <td colSpan={5} className="py-10 text-center text-gray-500">
                                No subscriptions found
                              </td>
                            </tr>
                          )}
                      </tbody>
                    </table>
                  </div>
                </Section>

              )
            }







          </div>
        )}

        {userData && phone && (
          <div className="mt-6  mx-auto">
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 tracking-wide">All Transactions</h3>
              </div>

              <div className="p-6">
                <div className="flex flex-col gap-6 mb-6">
                  <div className="flex flex-wrap gap-4">
                    <FilterGroup
                      title="Transaction Type"
                      tabs={TRANS_TYPE}
                      value={selectedType}
                      onChange={setSelectedType}
                    />

                    <FilterGroup
                      title="Status"
                      tabs={TRANS_STATUS}
                      value={selectedStatus}
                      onChange={setSelectedStatus}
                    />
                  </div>

                  <FilterGroup
                    title="Category"
                    tabs={SUB_TXN_TYPE}
                    value={selectedSubTxnType}
                    onChange={setSelectedSubTxnType}
                  />

                  <FilterGroup
                    title="Product"
                    tabs={TRANS_PRODUCT}
                    value={selectedProduct}
                    onChange={setSelectedProduct}
                  />
                </div>

                {allTransactionsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <>
                    <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
                      <table className="min-w-[500px] w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Transaction ID
                            </th>
                            {selectedType === "AUTOPAY" && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Payment ID
                            </th>}

                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Type
                            </th>

                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Quantity (g)
                            </th>

                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total Amount (₹)
                            </th>

                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Rate / g (₹)
                            </th>

                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Payment Mode
                            </th>

                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Gateway
                            </th>

                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>

                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Created At
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Updated At
                            </th>
                          </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200">
                          {txns.length > 0 ? (
                            txns.map((txn: any) => (
                              <tr key={txn.id} className="hover:bg-gray-50 transition">

                                {/* Transaction ID */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                                  {txn.external_txn_id}
                                </td>

                                {
                                  txn.txn_type === "AUTOPAY" && (
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                                      {txn.payment_id}
                                    </td>
                                  )
                                }


                                {/* Type */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                  {txn.txn_type}
                                </td>

                                {/* Gold Quantity */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {txn.qty_g} g
                                </td>

                                {/* Total Amount */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                  ₹{txn.total_value_rs.toLocaleString("en-IN", {
                                    minimumFractionDigits: 2,
                                  })}
                                </td>

                                {/* Rate per Gram */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                  ₹{txn.rate_per_g_wo_gst.toLocaleString("en-IN", {
                                    minimumFractionDigits: 2,
                                  })}
                                </td>

                                {/* Payment Mode */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                  {txn.payment_mode}
                                </td>

                                {/* Gateway */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                  {txn.gateway || "—"}
                                </td>

                                {/* Status */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  <StatusBadge status={txn.txn_status} />
                                </td>

                                {/* Date */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {formatDate(txn.created_at)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {formatDate(txn.updated_at)}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                                No transactions found
                              </td>
                            </tr>
                          )}
                        </tbody>

                      </table>
                    </div>

                    {/* Pagination */}
                    {totalTxns > 10 && (
                      <div className="mt-6 flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                          Showing <span className="font-medium">{(selectedPage - 1) * 10 + 1}</span> to{" "}
                          <span className="font-medium">
                            {Math.min(selectedPage * 10, totalTxns)}
                          </span>{" "}
                          of <span className="font-medium">{totalTxns}</span> results
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedPage((p) => Math.max(1, p - 1))}
                            disabled={selectedPage === 1}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                          >
                            Previous
                          </button>

                          <div className="flex items-center gap-1">
                            {Array.from({ length: Math.ceil(totalTxns / 10) }, (_, i) => i + 1)
                              .filter((page) => {
                                const totalPages = Math.ceil(totalTxns / 10);
                                return (
                                  page === 1 ||
                                  page === totalPages ||
                                  Math.abs(page - selectedPage) <= 1
                                );
                              })
                              .map((page, index, array) => (
                                <React.Fragment key={page}>
                                  {index > 0 && array[index - 1] !== page - 1 && (
                                    <span className="px-2 text-gray-500">...</span>
                                  )}
                                  <button
                                    onClick={() => setSelectedPage(page)}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition ${selectedPage === page
                                      ? "bg-primary text-white"
                                      : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                                      }`}
                                  >
                                    {page}
                                  </button>
                                </React.Fragment>
                              ))}
                          </div>

                          <button
                            onClick={() =>
                              setSelectedPage((p) => Math.min(Math.ceil(totalTxns / 10), p + 1))
                            }
                            disabled={selectedPage === Math.ceil(totalTxns / 10)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {!userData && !searchLoading && (
          <div className="text-center py-16">
            <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Results</h3>
            <p className="text-gray-500">Enter a phone number to search for user details</p>
          </div>
        )}
      </div>

      <Sidebar />
    </div>
  );
}