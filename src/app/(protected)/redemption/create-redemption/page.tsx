"use client"

import { useState } from "react"
import { Loader2, X } from "lucide-react"
import { PageHeader } from "../../../../components/dashboard/PageHeader"
import { UpiUserSearch } from "../../../../components/upiUserSearch"
import InputField from "../../../../components/ui/InputField"
import PillSelect from "../../../../components/ui/PillSelect"
import { useToast } from "../../../../context/toast.context"



export default function CreateRedemptionForm() {
  const [loading, setLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [userFound, setUserFound] = useState(false)
  const [userDetails, setUserDetails] = useState<any>({})

  const [phone, setPhone] = useState("")
  const [addresses, setAddresses] = useState<any[]>([])
  const [addressId, setAddressId] = useState("")

  const [productName, setProductName] = useState("Silver Coin")
  const [metalType, setMetalType] = useState("silver")
  const [productType, setProductType] = useState("coin")
  const [vaultValue, setVaultValue] = useState("0")
  const [isReconciled, setIsReconciled] = useState(true)
  const [reconcileLoading, setReconcileLoading] = useState(false)
  const [redemptionSuccess, setRedemptionSuccess] = useState(false)


  const [quantities, setQuantities] = useState<{ weight: string; qty: string }[]>([
    { weight: "50", qty: "1" }
  ])

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const { toast } = useToast()

  const validatePhone = (value: string) => {
    if (!value) return "Phone number is required"
    if (value.length !== 10) return "Phone number must be 10 digits"
    return ""
  }

  const validateVaultValue = (value: string) => {
    if (value === "") return "Vault value is required"
    if (isNaN(Number(value))) return "Must be a valid number"
    if (Number(value) < 0) return "Must be 0 or greater"
    return ""
  }

  const updateRow = (index: number, field: "weight" | "qty", value: string) => {
    setQuantities((q) =>
      q.map((row, i) =>
        i === index ? { ...row, [field]: value } : row
      )
    )
  }

  const addRow = () => {
    setQuantities((q) => [...q, { weight: "", qty: "" }])
  }

  const removeRow = (index: number) => {
    if (quantities.length > 1) {
      setQuantities((q) => q.filter((_, i) => i !== index))
    }
  }

  const fetchAddress = async (phoneNumber: string) => {
    try {
      setAddresses([])
      setAddressId("")

      const res = await fetch(`/api/address?phone_number=${phoneNumber}`)
      const data = await res.json()

      const fetchedAddresses = data?.success ? data.data?.addresses ?? [] : []
      setAddresses(fetchedAddresses)

      if (fetchedAddresses.length === 0) {
        toast({
          title: "No addresses found",
          description: "User has no saved delivery addresses",
        })
      }
    } catch (error) {
      setAddresses([])
      toast({
        title: "Error",
        description: "Failed to fetch addresses",
      })
    }
  }

  const handleSearch = async (e) => {
    e?.preventDefault()
    const phoneError = validatePhone(phone)
    if (phoneError) {
      toast({
        title: "Invalid phone number",
        description: phoneError,
      })
      return
    }

    try {
      setSearchLoading(true)
      setUserFound(false)

      const res = await fetch(`/api/profile?phone_number=${phone}`)
      const data = await res.json()

      if (data?.success) {
        setUserFound(true)

        setUserDetails(data.data);
        await fetchAddress(phone)
        toast({
          title: "User found",
          description: "User profile loaded successfully",
        })
      } else {
        setAddresses([])
        setUserFound(false)
        toast({
          title: "User not found",
          description: data?.message || "No user exists with this phone number",
        })
      }
    } catch (error) {
      setUserFound(false)
      toast({
        title: "Search failed",
        description: "Unable to search for user",
      })
    } finally {
      setSearchLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (loading) return

    const errors: Record<string, string> = {}

    const phoneError = validatePhone(phone)
    if (phoneError) errors.phone = phoneError

    if (!addressId) {
      errors.addressId = "Please select a delivery address"
    }

    const validQuantities = quantities.filter((q) => {
      const weight = q.weight.trim()
      const qty = Number(q.qty)
      return weight && !isNaN(qty) && qty > 0
    })

    if (validQuantities.length === 0) {
      errors.quantities = "At least one valid weight and quantity is required"
    }

    const weights = validQuantities.map((q) => q.weight)
    const duplicateWeights = weights.filter(
      (w, i) => weights.indexOf(w) !== i
    )
    if (duplicateWeights.length > 0) {
      errors.quantities = `Duplicate weights found: ${duplicateWeights.join(", ")}g`
    }

    const vaultError = validateVaultValue(vaultValue)
    if (vaultError) errors.vaultValue = vaultError

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
      })
      return
    }

    setFormErrors({})

    const cleanQuantities = Object.fromEntries(
      validQuantities.map((q) => [q.weight, Number(q.qty)])
    )

    const payload = {
      phone_number: phone,
      product_name: productName.trim(),
      metal_type: metalType,
      product_type: productType,
      quantities: cleanQuantities,
      vault_value: Number(vaultValue),
      address_id: Number(addressId),
      platform: "web",
      version: "4.0.0",
      mode: "prod",
    }

    try {
      setLoading(true)

      const response = await fetch("/api/redemption-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.message || "Failed to create redemption")
      }


      setRedemptionSuccess(true)
      setIsReconciled(false)
      toast({
        title: "Success!",
        description: "Redemption created successfully",
      })



      setAddressId("")

      setProductName("Silver Coin")
      setMetalType("silver")
      setProductType("coin")
      setVaultValue("0")
      setQuantities([{ weight: "50", qty: "1" }])
      setFormErrors({})
    } catch (err: any) {
      toast({
        title: "Creation failed",
        description: err?.message || "Something went wrong",
      })
    } finally {
      setLoading(false)
    }
  }





  const handleReconcilePortfolio = async () => {
    // if (!phone) return;

    setReconcileLoading(true);
    try {
      const res = await fetch("/api/reconcile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_number: phone,
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


  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset the form?")) {
      setProductName("Silver Coin")
      setMetalType("silver")
      setProductType("coin")
      setVaultValue("0")
      setQuantities([{ weight: "50", qty: "1" }])
      setAddressId("")
      setFormErrors({})
    }
  }


  const getUserFullName = () => {
    if (!userDetails) return "";
    return `${userDetails?.user?.first_name} ${userDetails?.user?.last_name}`.trim();
  };


  return (
    <div className="min-h-screen p-6">
      <div className="">

        <PageHeader
          title="Create Redemption"
          subtitle="Create a new redemption request for a customer"
        />


        <div className="mb-6 max-w-4xl mx-auto">
          <UpiUserSearch
            input={phone}
            setInput={setPhone}
            handleSubmit={handleSearch}
            placeholder="Enter 10-digit phone number"
            loading={searchLoading}
          />

        </div>
        {userDetails && userFound &&
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm mb-4 overflow-hidden">

            <div className="p-6">
              <h1 className="text-xl py-2 font-semibold">
                User Profile
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Full Name</p>
                  <p className="text-lg font-semibold text-gray-900">{getUserFullName()}</p>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Phone Number</p>
                  <p className="text-lg font-semibold text-gray-900 font-mono">{userDetails?.user?.phone_number}</p>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={handleReconcilePortfolio}
                  disabled={reconcileLoading || isReconciled}
                  className="bg-primary text-white px-8 py-2.5 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium"
                >
                  {reconcileLoading
                    ? "Reconciling..."
                    : isReconciled
                      ? "Portfolio Reconciled"
                      : "Reconcile Portfolio"}
                </button>
              </div>



            </div>


          </div>}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">

          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Product Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Product Name *"
                  value={productName}
                  onChange={(e: any) => setProductName(e.target.value)}
                  placeholder="e.g., Silver Coin"
                  error={formErrors.productName}
                />

                <PillSelect
                  label="Metal Type *"
                  value={metalType}
                  onChange={setMetalType}
                  options={[
                    { label: "Gold", value: "gold" },
                    { label: "Silver", value: "silver" },
                  ]}
                  error={formErrors.metalType}
                />

                <PillSelect
                  label="Product Type *"
                  value={productType}
                  onChange={setProductType}
                  options={[
                    { label: "Coin", value: "coin" },
                    { label: "Bar", value: "bar" },
                    { label: "Pendant", value: "pendant" },
                  ]}
                  error={formErrors.productType}
                />

                <InputField
                  label="Vault Value (grams) *"
                  type="number"
                  step="0.01"
                  min="0"
                  value={vaultValue}
                  onChange={(e: any) => {
                    setVaultValue(e.target.value)
                    setFormErrors((prev) => ({ ...prev, vaultValue: "" }))
                  }}
                  placeholder="0.00"
                  error={formErrors.vaultValue}
                />
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Quantities
              </h2>
              <div className="space-y-3">
                {quantities.map((row, i) => (
                  <div key={i} className="flex items-end gap-3">
                    <div className="flex-1">
                      <InputField
                        label={i === 0 ? "Weight (grams) *" : ""}
                        type="number"
                        step="0.01"
                        min="0"
                        value={row.weight}
                        onChange={(e: any) => {
                          updateRow(i, "weight", e.target.value)
                          setFormErrors((prev) => ({ ...prev, quantities: "" }))
                        }}
                        placeholder="e.g., 50"
                      />
                    </div>

                    <div className="flex-1">
                      <InputField
                        label={i === 0 ? "Quantity *" : ""}
                        type="number"
                        min="1"
                        value={row.qty}
                        onChange={(e: any) => {
                          updateRow(i, "qty", e.target.value)
                          setFormErrors((prev) => ({ ...prev, quantities: "" }))
                        }}
                        placeholder="e.g., 1"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeRow(i)}
                      disabled={quantities.length === 1}
                      className={`p-2.5 rounded-md transition-colors ${quantities.length === 1
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-red-600 hover:bg-red-50"
                        }`}
                      title={quantities.length === 1 ? "At least one row required" : "Remove row"}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}

                {formErrors.quantities && (
                  <p className="text-sm text-red-600">{formErrors.quantities}</p>
                )}

                <button
                  type="button"
                  onClick={addRow}
                  className="text-primary text-sm font-medium hover:text-blue-700 transition-colors"
                >
                  + Add another weight
                </button>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Delivery Information
              </h2>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Delivery Address *
                </label>
                <select
                  value={addressId}
                  onChange={(e) => {
                    setAddressId(e.target.value)
                    setFormErrors((prev) => ({ ...prev, addressId: "" }))
                  }}
                  className={`w-full px-3 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${formErrors.addressId ? "border-red-500" : "border-gray-300"
                    } ${!addresses.length
                      ? "bg-gray-50 cursor-not-allowed"
                      : "bg-white"
                    }`}
                  disabled={!addresses.length}
                >
                  <option value="">
                    {addresses.length === 0
                      ? "No addresses available - search for user first"
                      : "Select delivery address"}
                  </option>
                  {addresses.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} • {a.city}, {a.state} - {a.pincode}
                    </option>
                  ))}
                </select>
                {formErrors.addressId && (
                  <p className="text-xs text-red-600">{formErrors.addressId}</p>
                )}
                {!userFound && (
                  <p className="text-xs text-gray-500">
                    Search for a user to load their addresses
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2.5 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Reset
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || !userFound}
                className="bg-primary text-white px-8 py-2.5 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Creating..." : "Create Redemption"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}