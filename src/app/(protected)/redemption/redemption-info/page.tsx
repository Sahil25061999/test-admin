"use client"

import { useEffect, useState } from "react"
import PillSelect from "../../../../components/ui/PillSelect"
import { PageHeader } from "../../../../components/dashboard/PageHeader"
import { Loader2 } from "lucide-react"
import InputField from "../../../../components/ui/InputField"
import { useToast } from "../../../../context/toast.context"

const Page = () => {
  const [metalType, setMetalType] = useState("gold")
  const [productType, setProductType] = useState("COIN")
  const [selectedWeight, setSelectedWeight] = useState("")
  const [weightData, setWeightData] = useState<any[]>([])
  const [loadingWeights, setLoadingWeights] = useState(false)
  const [hasNoWeights, setHasNoWeights] = useState(false)

  const [fetchedQuantity, setFetchedQuantity] = useState<number | null>(null)
  const [inputQuantity, setInputQuantity] = useState<number | null>(null)
  const [loadingQuantity, setLoadingQuantity] = useState(false)
  const [updating, setUpdating] = useState(false)
  const { toast } = useToast()

  const metalTypeOptions = [
    { label: "Gold", value: "gold" },
    { label: "Silver", value: "silver" },
  ]

  const productTypeOptions = [
    { label: "Coin", value: "COIN" },
    { label: "Bar", value: "BAR" },
    { label: "Pendant", value: "PENDANT" },
  ]


  const fetchRedemptionInfo = async () => {
    setLoadingWeights(true)
    setHasNoWeights(false)
    setSelectedWeight("")
    setWeightData([])
    setFetchedQuantity(null)
    setInputQuantity(null)
    setLoadingQuantity(false)

    try {
      const res = await fetch(
        `/api/redemption-info?metal_type=${metalType}&product_type=${productType}`
      )
      const data = await res.json()

      if (!data?.success || !data?.data?.redemption_info?.length) {
        setHasNoWeights(true)
        return
      }

      const cleaned = data.data.redemption_info.map((item: any) => ({
        label: `${item.weight} g`,
        value: item.weight,
      }))
      setWeightData(cleaned)
    } catch {
      setHasNoWeights(true)
    } finally {
      setLoadingWeights(false)
    }
  }


  const fetchQuantity = async () => {
    if (!selectedWeight) {
      setFetchedQuantity(null)
      setInputQuantity(null)
      setLoadingQuantity(false)
      return
    }

    setLoadingQuantity(true)
    try {
      const res = await fetch(
        `/api/redemption-admin?metal_type=${metalType}&product_type=${productType}&weight=${selectedWeight}`
      )
      const data = await res.json()
      const qty = data?.data?.products?.[0]?.available_quantity ?? null
      setFetchedQuantity(qty)
      setInputQuantity(qty ?? "")
    } catch (err) {
      console.error(err)
      setFetchedQuantity(null)
      setInputQuantity(null)
    } finally {
      setLoadingQuantity(false)
    }
  }

  const handleUpdateQuantity = async () => {
    if (!selectedWeight) return
    setUpdating(true)
    try {
      const res = await fetch("/api/redemption-info", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metal_type: metalType,
          product_type: productType,
          weight: selectedWeight,
          quantity: Number(inputQuantity),
        }),
      })
      const data = await res.json()
      if (data?.success) {
        toast({
          title: "Success",
          description: data?.message || "Redemption info updated successfully",
          variant: "success",
        })
        fetchRedemptionInfo()
      } else {
        toast({
          title: "Error",
          description: data?.message || "Failed to update redemption info",
          variant: "error",
        })
      }

    } catch (err: any) {
      console.error(err)
      toast({
        title: "Error",
        description: err?.message || err?.response?.data?.message || "Failed to update redemption info",
        variant: "error",
      })
    } finally {
      setUpdating(false)
    }
  }


  useEffect(() => {
    fetchRedemptionInfo()
  }, [metalType, productType])

  useEffect(() => {
    fetchQuantity()
  }, [selectedWeight, productType, metalType])


  const isAnyLoading = loadingWeights || loadingQuantity || updating

  return (
    <div className="min-h-screen p-6">
      <PageHeader
        title="Redemption Info"
        subtitle="View available redemption options for the selected metal and product type"
      />
      <div className="mx-auto bg-white rounded-md my-4 border border-gray-200 p-6 space-y-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Redemption Info
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PillSelect
            options={metalTypeOptions}
            value={metalType}
            onChange={setMetalType}
            label="Metal Type"
            disabled={isAnyLoading}
          />
          <PillSelect
            options={productTypeOptions}
            value={productType}
            onChange={setProductType}
            label="Product Type"
            disabled={isAnyLoading}
          />
        </div>

        <div>
          {loadingWeights ? (
            <div className="flex items-center justify-center p-10">
              <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            </div>
          ) : hasNoWeights ? (
            <div className="text-center py-10 text-gray-500">
              No weights available for selected metal and product type.
            </div>
          ) : (
            <PillSelect
              options={weightData}
              value={selectedWeight}
              onChange={setSelectedWeight}
              label="Weight"
              disabled={isAnyLoading}
            />
          )}
        </div>

        {selectedWeight && (
          <div>
            {loadingQuantity ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
              </div>
            ) : fetchedQuantity !== null ? (
              <>
                <InputField
                  label="Quantity"
                  value={inputQuantity ?? ""}
                  onChange={(e) => {
                    const val = e.target.value

                    if (val === "" || /^\d+$/.test(val)) {
                      setInputQuantity(val === "" ? null : Number(val))
                    }
                  }}
                  disabled={isAnyLoading}
                />

                <p className="text-gray-400 text-sm mt-1">
                  Fetched quantity: {fetchedQuantity}
                </p>
              </>
            ) : null}
          </div>
        )}

        <div className="flex items-center justify-end">

          {productType && metalType && selectedWeight && inputQuantity > 0 && (
            <button
              type="button"
              onClick={handleUpdateQuantity}
              disabled={isAnyLoading}
              className={`bg-primary text-white px-8 py-2.5 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium`}
            >
              {updating && <Loader2 className="h-4 w-4 animate-spin" />}
              {updating ? "Updating..." : "Update Quantity"}
            </button>
          )}

        </div>

      </div>
    </div>
  )
}

export default Page
