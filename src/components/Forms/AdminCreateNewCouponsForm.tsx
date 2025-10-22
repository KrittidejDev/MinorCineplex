import { useState } from "react"
import ModalEmpty from "../Modals/ModalEmpty"
import { Button } from "../ui/button"
import axios from "axios"
import Image from "next/image"
import { CreateCouponInput, GiftDetails } from "@/types/coupon"

interface AdminCreateNewCouponFormProps {
  isShowModal: boolean
  onClose: () => void
}

type DiscountType = CreateCouponInput["discount_type"]
type GiftType = CreateCouponInput["gift_type"]
type CouponStatus = NonNullable<CreateCouponInput["status"]>

function AdminCreateNewCouponForm({ isShowModal, onClose }: AdminCreateNewCouponFormProps) {
  const [formData, setFormData] = useState<CreateCouponInput>({
    slug: "",
    code: "",
    translations: {
      en: { name: "", description: "" },
      th: { name: "", description: "" },
    },
    discount_type: "FIXED",
    discount_value: null,
    buy_quantity: undefined,
    get_quantity: undefined,
    gift_type: undefined,
    gift_details: undefined,
    start_date: "",
    end_date: "",
    status: "ACTIVE",
    min_amount: null,
    max_discount: null,
    usage_limit: null,
    image_url: null,
  })

  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Type guards
  const isPopcornGift = (d: GiftDetails | undefined): d is { item: string; size?: string } => !!d && "item" in d
  const isCouponGift = (d: GiftDetails | undefined): d is { code: string } => !!d && "code" in d
  const isOtherGift = (d: GiftDetails | undefined): d is { other: string } => !!d && "other" in d

  const handleChange = <T extends keyof CreateCouponInput>(field: T, value: CreateCouponInput[T]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleGiftTypeChange = (value: GiftType) => {
    let defaultDetails: GiftDetails
    switch (value) {
      case "POPCORN":
        defaultDetails = { item: "", size: "" }
        break
      case "COUPON_CODE":
        defaultDetails = { code: "" }
        break
      case "OTHER":
        defaultDetails = { other: "" }
        break
      default:
        handleChange("gift_type", undefined)
        handleChange("gift_details", undefined)
        return
    }
    handleChange("gift_type", value)
    handleChange("gift_details", defaultDetails)
  }

  const handleTranslationChange = (lang: "en" | "th", field: "name" | "description", value: string) => {
    setFormData((prev) => ({
      ...prev,
      translations: {
        ...(prev.translations ?? { en: { name: "", description: "" }, th: { name: "", description: "" } }),
        [lang]: { ...(prev.translations?.[lang] ?? { name: "", description: "" }), [field]: value },
      },
    }))
  }

  const handleImageSelect = (file: File | null) => {
    setImageFile(file)
    setImagePreview(file ? URL.createObjectURL(file) : null)
  }

  const handleImageUpload = async (file: File): Promise<string> => {
    const form = new FormData()
    form.append("file", file)
    const res = await axios.post("/api/file-upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return res.data.url
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // ✅ ตรวจความครบถ้วน
    const requiredFields: (keyof CreateCouponInput)[] = ["slug", "start_date", "end_date", "discount_type"]
    const missing = requiredFields.filter((f) => !formData[f])
    if (missing.length > 0) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน: " + missing.join(", "))
      return
    }

    setLoading(true)
    try {
      let imageUrl = formData.image_url
      if (imageFile) imageUrl = await handleImageUpload(imageFile)

      const payload: CreateCouponInput = {
        ...formData,
        image_url: imageUrl,
        discount_value: formData.discount_value ? Number(formData.discount_value) : null,
        min_amount: formData.min_amount ? Number(formData.min_amount) : null,
        max_discount: formData.max_discount ? Number(formData.max_discount) : null,
        usage_limit: formData.usage_limit ? Number(formData.usage_limit) : null,
      }

      const res = await axios.post("/api/coupons", payload)
      if (res.status === 201) {
        alert("✅ สร้างคูปองสำเร็จ!")
        onClose()
      }
    } catch (err) {
      console.error(err)
      alert("❌ สร้างคูปองไม่สำเร็จ")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ModalEmpty isShowModal={isShowModal} onClose={onClose}>
      <div className="bg-black w-[900px] rounded-md shadow-lg py-10 px-14 overflow-y-auto max-h-[90vh]">
        <h1 className="text-3xl font-bold text-white mb-2">Create Coupon</h1>
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {/* 🧾 Coupon Core Fields */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="font-semibold">Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => handleChange("slug", e.target.value)}
                className="w-full border border-blue-300 rounded-md p-3 mt-1"
              />
            </div>
            <div>
              <label className="font-semibold">Coupon Code</label>
              <input
                type="text"
                value={formData.code ?? ""}
                onChange={(e) => handleChange("code", e.target.value)}
                className="w-full border border-blue-300 rounded-md p-3 mt-1"
              />
            </div>
            <div>
              <label className="font-semibold">Discount Type</label>
              <select
                value={formData.discount_type}
                onChange={(e) => handleChange("discount_type", e.target.value as DiscountType)}
                className="w-full border border-blue-300 rounded-md p-3 mt-1"
              >
                <option value="FIXED">Fixed</option>
                <option value="PERCENTAGE">Percentage</option>
                <option value="BUY_X_GET_Y">Buy X Get Y</option>
                <option value="GIFT">Gift</option>
              </select>
            </div>
            <div>
              <label className="font-semibold">Discount Value</label>
              <input
                type="number"
                value={formData.discount_value ?? ""}
                onChange={(e) => handleChange("discount_value", Number(e.target.value))}
                className="w-full border border-blue-300 rounded-md p-3 mt-1"
              />
            </div>
          </div>

          {/* 🧮 Dynamic Fields */}
          {formData.discount_type === "BUY_X_GET_Y" && (
            <div className="grid grid-cols-2 gap-6">
              <input
                type="number"
                placeholder="Buy Quantity"
                value={formData.buy_quantity ?? ""}
                onChange={(e) => handleChange("buy_quantity", Number(e.target.value))}
                className="border border-blue-300 rounded-md p-3"
              />
              <input
                type="number"
                placeholder="Get Quantity"
                value={formData.get_quantity ?? ""}
                onChange={(e) => handleChange("get_quantity", Number(e.target.value))}
                className="border border-blue-300 rounded-md p-3"
              />
            </div>
          )}

          {formData.discount_type === "GIFT" && (
            <div className="grid grid-cols-2 gap-6">
              <select
                value={formData.gift_type ?? ""}
                onChange={(e) => handleGiftTypeChange(e.target.value as GiftType)}
                className="border border-blue-300 rounded-md p-3"
              >
                <option value="">Select Gift Type</option>
                <option value="POPCORN">Popcorn</option>
                <option value="COUPON_CODE">Coupon Code</option>
                <option value="OTHER">Other</option>
              </select>

              {formData.gift_type === "POPCORN" && isPopcornGift(formData.gift_details) && (
                <>
                  <input
                    type="text"
                    placeholder="Item"
                    value={formData.gift_details.item}
                    onChange={(e) => handleChange("gift_details", { ...formData.gift_details, item: e.target.value })}
                    className="border border-blue-300 rounded-md p-3"
                  />
                  <input
                    type="text"
                    placeholder="Size"
                    value={formData.gift_details.size ?? ""}
                    onChange={(e) => handleChange("gift_details", { ...formData.gift_details, size: e.target.value })}
                    className="border border-blue-300 rounded-md p-3"
                  />
                </>
              )}

              {formData.gift_type === "COUPON_CODE" && isCouponGift(formData.gift_details) && (
                <input
                  type="text"
                  placeholder="Code"
                  value={formData.gift_details.code}
                  onChange={(e) => handleChange("gift_details", { ...formData.gift_details, code: e.target.value })}
                  className="border border-blue-300 rounded-md p-3"
                />
              )}

              {formData.gift_type === "OTHER" && isOtherGift(formData.gift_details) && (
                <input
                  type="text"
                  placeholder="Other Details"
                  value={formData.gift_details.other}
                  onChange={(e) => handleChange("gift_details", { ...formData.gift_details, other: e.target.value })}
                  className="border border-blue-300 rounded-md p-3"
                />
              )}
            </div>
          )}

          {/* 🌐 Translations */}
          <div className="grid grid-cols-2 gap-6">
            {(["en", "th"] as const).map((lang) => (
              <div key={lang}>
                <label className="font-semibold">Title ({lang.toUpperCase()})</label>
                <input
                  type="text"
                  value={formData.translations?.[lang]?.name ?? ""}
                  onChange={(e) => handleTranslationChange(lang, "name", e.target.value)}
                  className="w-full border border-blue-300 rounded-md p-3 mt-1"
                />
                <label className="font-semibold mt-2">Description ({lang.toUpperCase()})</label>
                <textarea
                  rows={3}
                  value={formData.translations?.[lang]?.description ?? ""}
                  onChange={(e) => handleTranslationChange(lang, "description", e.target.value)}
                  className="w-full border border-blue-300 rounded-md p-3 mt-1"
                />
              </div>
            ))}
          </div>

          {/* 📅 Dates + Status */}
          <div className="grid grid-cols-2 gap-6">
            <input
              type="date"
              value={formData.start_date as string}
              onChange={(e) => handleChange("start_date", e.target.value)}
              className="border border-blue-300 rounded-md p-3"
            />
            <input
              type="date"
              value={formData.end_date as string}
              onChange={(e) => handleChange("end_date", e.target.value)}
              className="border border-blue-300 rounded-md p-3"
            />
            <select
              value={formData.status ?? "ACTIVE"}
              onChange={(e) => handleChange("status", e.target.value as CouponStatus)}
              className="border border-blue-300 rounded-md p-3"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="EXPIRED">Expired</option>
            </select>
          </div>

          {/* 🖼 Image Upload */}
          <div>
            <input type="file" accept="image/*" onChange={(e) => handleImageSelect(e.target.files?.[0] ?? null)} />
            {imagePreview && (
              <div className="mt-2 w-[150px] h-[150px] relative">
                <Image src={imagePreview} alt="Preview" fill className="object-cover rounded-md" />
              </div>
            )}
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Coupon"}
          </Button>
        </form>
      </div>
    </ModalEmpty>
  )
}

export default AdminCreateNewCouponForm
