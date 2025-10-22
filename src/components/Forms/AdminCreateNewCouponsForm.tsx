import { useState } from 'react'
import ModalEmpty from '../Modals/ModalEmpty'
import { Button } from '../ui/button'
import axios from 'axios'
import Image from 'next/image'
import { CreateCouponInput, GiftDetails } from '@/types/coupon'

interface AdminCreateNewCouponFormProps {
  isShowModal: boolean
  onClose: () => void
}

// type-safe aliases
type DiscountType = CreateCouponInput['discount_type']
type GiftType = CreateCouponInput['gift_type']

function AdminCreateNewCouponForm({
  isShowModal,
  onClose,
}: AdminCreateNewCouponFormProps) {
  const [formData, setFormData] = useState<CreateCouponInput>({
    slug: '',
    code: '',
    translations: {
      en: { name: '', description: '' },
      th: { name: '', description: '' },
    },
    discount_type: 'FIXED',
    discount_value: null,
    buy_quantity: undefined,
    get_quantity: undefined,
    gift_type: undefined,
    gift_details: undefined,
    start_date: '',
    end_date: '',
    status: 'ACTIVE',
    min_amount: null,
    max_discount: null,
    usage_limit: null,
    image_url: null,
  })

  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Type guards for gift_details
  const isPopcornGift = (details: GiftDetails | undefined): details is { item: string; size?: string } =>
    !!details && 'item' in details
  const isCouponGift = (details: GiftDetails | undefined): details is { code: string } =>
    !!details && 'code' in details
  const isOtherGift = (details: GiftDetails | undefined): details is { other: string } =>
    !!details && 'other' in details

  const handleChange = <T extends keyof CreateCouponInput>(field: T, value: CreateCouponInput[T]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleGiftTypeChange = (value: GiftType) => {
    let defaultDetails: GiftDetails
    switch (value) {
      case 'POPCORN':
        defaultDetails = { item: '', size: '' }
        break
      case 'COUPON_CODE':
        defaultDetails = { code: '' }
        break
      case 'OTHER':
        defaultDetails = { other: '' }
        break
      default:
        handleChange('gift_type', undefined)
        handleChange('gift_details', undefined)
        return
    }

    handleChange('gift_type', value)
    handleChange('gift_details', defaultDetails)
  }

  const handleTranslationChange = (lang: 'en' | 'th', field: 'name' | 'description', value: string) => {
    setFormData((prev) => ({
      ...prev,
      translations: {
        ...(prev.translations ?? { en: { name: '', description: '' }, th: { name: '', description: '' } }),
        [lang]: { ...(prev.translations?.[lang] ?? { name: '', description: '' }), [field]: value },
      },
    }))
  }

  const handleImageSelect = (file: File | null) => {
    setImageFile(file)
    setImagePreview(file ? URL.createObjectURL(file) : null)
  }

  const handleImageUpload = async (file: File): Promise<string> => {
    const form = new FormData()
    form.append('file', file)
    const res = await axios.post('/api/file-upload', form, { headers: { 'Content-Type': 'multipart/form-data' } })
    return res.data.url
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.slug || !formData.start_date || !formData.end_date) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน')
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

      const res = await axios.post('/api/coupons', payload)
      if (res.status === 201) {
        alert('✅ สร้างคูปองสำเร็จ!')
        onClose()
        setFormData({
          slug: '',
          code: '',
          translations: { en: { name: '', description: '' }, th: { name: '', description: '' } },
          discount_type: 'FIXED',
          discount_value: null,
          buy_quantity: undefined,
          get_quantity: undefined,
          gift_type: undefined,
          gift_details: undefined,
          start_date: '',
          end_date: '',
          status: 'ACTIVE',
          min_amount: null,
          max_discount: null,
          usage_limit: null,
          image_url: null,
        })
        setImageFile(null)
        setImagePreview(null)
      }
    } catch (err) {
      console.error(err)
      alert('❌ สร้างคูปองไม่สำเร็จ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ModalEmpty isShowModal={isShowModal} onClose={onClose}>
      <div className="bg-white w-[900px] rounded-md shadow-lg py-10 px-14 overflow-y-auto max-h-[90vh]">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Coupon</h1>
        <p className="text-gray-500 text-sm mb-8">Fill in the details below to create a new promotional coupon.</p>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {/* Coupon Code + Discount */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-blue-700 text-sm font-semibold">Coupon Code</label>
              <input
                type="text"
                placeholder="e.g SMR20PC"
                value={formData.code ?? ''}
                onChange={(e) => handleChange('code', e.target.value)}
                className="w-full border border-blue-300 rounded-md p-3 mt-1 placeholder:text-gray-400 text-blue-700"
              />
            </div>
            <div>
              <label className="text-blue-700 text-sm font-semibold">Discount Value</label>
              <input
                type="number"
                placeholder="e.g 500"
                value={formData.discount_value ?? ''}
                onChange={(e) => handleChange('discount_value', Number(e.target.value))}
                className="w-full border border-blue-300 rounded-md p-3 mt-1 placeholder:text-gray-400 text-blue-700"
              />
            </div>
            <div>
              <label className="text-blue-700 text-sm font-semibold">Discount type</label>
              <select
                value={formData.discount_type}
                onChange={(e) => handleChange('discount_type', e.target.value as DiscountType)}
                className="w-full border border-blue-300 rounded-md p-3 mt-1"
              >
                <option value="FIXED">Fixed</option>
                <option value="PERCENTAGE">Percentage</option>
                <option value="BUY_X_GET_Y">Buy X Get Y</option>
                <option value="GIFT">Gift</option>
              </select>
            </div>
          </div>

          {/* Dynamic Fields */}
          {formData.discount_type === 'BUY_X_GET_Y' && (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-blue-700 text-sm font-semibold">Buy Quantity</label>
                <input
                  type="number"
                  value={formData.buy_quantity ?? ''}
                  onChange={(e) => handleChange('buy_quantity', Number(e.target.value))}
                  className="w-full border border-blue-300 rounded-md p-3 mt-1"
                />
              </div>
              <div>
                <label className="text-blue-700 text-sm font-semibold">Get Quantity</label>
                <input
                  type="number"
                  value={formData.get_quantity ?? ''}
                  onChange={(e) => handleChange('get_quantity', Number(e.target.value))}
                  className="w-full border border-blue-300 rounded-md p-3 mt-1"
                />
              </div>
            </div>
          )}

          {formData.discount_type === 'GIFT' && (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-blue-700 text-sm font-semibold">Gift Type</label>
                <select
                  value={formData.gift_type ?? ''}
                  onChange={(e) => handleGiftTypeChange(e.target.value as GiftType)}
                  className="w-full border border-blue-300 rounded-md p-3 mt-1"
                >
                  <option value="">Select Gift Type</option>
                  <option value="POPCORN">Popcorn</option>
                  <option value="COUPON_CODE">Coupon Code</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              {/* Dynamic Gift Details */}
              {formData.gift_type === 'POPCORN' && isPopcornGift(formData.gift_details) && (
                <>
                  <div>
                    <label className="text-blue-700 text-sm font-semibold">Item</label>
                    <input
                      type="text"
                      value={formData.gift_details.item}
                      onChange={(e) =>
                        handleChange('gift_details', { ...formData.gift_details, item: e.target.value })
                      }
                      className="w-full border border-blue-300 rounded-md p-3 mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-blue-700 text-sm font-semibold">Size</label>
                    <input
                      type="text"
                      value={formData.gift_details.size ?? ''}
                      onChange={(e) =>
                        handleChange('gift_details', { ...formData.gift_details, size: e.target.value })
                      }
                      className="w-full border border-blue-300 rounded-md p-3 mt-1"
                    />
                  </div>
                </>
              )}

              {formData.gift_type === 'COUPON_CODE' && isCouponGift(formData.gift_details) && (
                <div>
                  <label className="text-blue-700 text-sm font-semibold">Code</label>
                  <input
                    type="text"
                    value={formData.gift_details.code}
                    onChange={(e) =>
                      handleChange('gift_details', { ...formData.gift_details, code: e.target.value })
                    }
                    className="w-full border border-blue-300 rounded-md p-3 mt-1"
                  />
                </div>
              )}

              {formData.gift_type === 'OTHER' && isOtherGift(formData.gift_details) && (
                <div>
                  <label className="text-blue-700 text-sm font-semibold">Other Details</label>
                  <input
                    type="text"
                    value={formData.gift_details.other}
                    onChange={(e) =>
                      handleChange('gift_details', { ...formData.gift_details, other: e.target.value })
                    }
                    className="w-full border border-blue-300 rounded-md p-3 mt-1"
                  />
                </div>
              )}
            </div>
          )}

          {/* Translations */}
          <div className="grid grid-cols-2 gap-6">
            {(['en', 'th'] as const).map((lang) => (
              <div key={lang}>
                <label className="text-blue-700 text-sm font-semibold">Title ({lang.toUpperCase()})</label>
                <input
                  type="text"
                  placeholder={`${lang.toUpperCase()} Title`}
                  value={formData.translations?.[lang]?.name ?? ''}
                  onChange={(e) => handleTranslationChange(lang, 'name', e.target.value)}
                  className="w-full border border-blue-300 rounded-md p-3 mt-1 placeholder:text-gray-400 text-blue-700"
                />
                <label className="text-blue-700 text-sm font-semibold mt-2">Description ({lang.toUpperCase()})</label>
                <textarea
                  placeholder={`${lang.toUpperCase()} Description`}
                  value={formData.translations?.[lang]?.description ?? ''}
                  onChange={(e) => handleTranslationChange(lang, 'description', e.target.value)}
                  className="w-full border border-blue-300 rounded-md p-3 mt-1 placeholder:text-gray-400 text-blue-700"
                  rows={3}
                />
              </div>
            ))}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-blue-700 text-sm font-semibold">Start Date</label>
              <input
                type="date"
                value={formData.start_date as string}
                onChange={(e) => handleChange('start_date', e.target.value)}
                className="w-full border border-blue-300 rounded-md p-3 mt-1 text-blue-700"
              />
            </div>
            <div>
              <label className="text-blue-700 text-sm font-semibold">End Date</label>
              <input
                type="date"
                value={formData.end_date as string}
                onChange={(e) => handleChange('end_date', e.target.value)}
                className="w-full border border-blue-300 rounded-md p-3 mt-1 text-blue-700"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="text-blue-700 text-sm font-semibold">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageSelect(e.target.files ? e.target.files[0] : null)}
              className="block mt-1"
            />
            {imagePreview && (
              <div className="mt-2 w-[150px] h-[150px] relative">
                <Image src={imagePreview} alt="Preview" fill className="object-cover rounded-md" />
              </div>
            )}
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Coupon'}
          </Button>
        </form>
      </div>
    </ModalEmpty>
  )
}

export default AdminCreateNewCouponForm
