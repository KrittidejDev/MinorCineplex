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

type DiscountType = CreateCouponInput['discount_type']
type GiftType = CreateCouponInput['gift_type']
type CouponStatus = NonNullable<CreateCouponInput['status']>

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

  // Type guards
  const isPopcornGift = (
    d: GiftDetails | undefined
  ): d is { item: string; size?: string } => !!d && 'item' in d

  const isCouponGift = (d: GiftDetails | undefined): d is { code: string } =>
    !!d && 'code' in d

  const isOtherGift = (d: GiftDetails | undefined): d is { other: string } =>
    !!d && 'other' in d

  const handleChange = <T extends keyof CreateCouponInput>(
    field: T,
    value: CreateCouponInput[T]
  ) => {
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

  const handleTranslationChange = (
    lang: 'en' | 'th',
    field: 'name' | 'description',
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      translations: {
        ...(prev.translations ?? {
          en: { name: '', description: '' },
          th: { name: '', description: '' },
        }),
        [lang]: {
          ...(prev.translations?.[lang] ?? { name: '', description: '' }),
          [field]: value,
        },
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
    const res = await axios.post('/api/file-upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data.url
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  
    // ✅ ตรวจความครบถ้วน
    const requiredFields: (keyof CreateCouponInput)[] = [
      'slug',
      'start_date',
      'end_date',
      'discount_type',
    ]
    const missing = requiredFields.filter((f) => !formData[f])
    if (missing.length > 0) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน: ' + missing.join(', '))
      return
    }
  
    // ✅ Validate BUY_X_GET_Y
    if (formData.discount_type === 'BUY_X_GET_Y') {
      if (!formData.buy_quantity || !formData.get_quantity) {
        alert('กรุณากรอก Buy Quantity และ Get Quantity')
        return
      }
      // เช็คว่าเป็นตัวเลขที่ถูกต้อง
      if (isNaN(Number(formData.buy_quantity)) || isNaN(Number(formData.get_quantity))) {
        alert('Buy Quantity และ Get Quantity ต้องเป็นตัวเลข')
        return
      }
      if (Number(formData.buy_quantity) < 1 || Number(formData.get_quantity) < 1) {
        alert('Buy Quantity และ Get Quantity ต้องมากกว่า 0')
        return
      }
    }
  
    // ✅ Validate GIFT
    if (formData.discount_type === 'GIFT') {
      if (!formData.gift_type || !formData.gift_details) {
        alert('กรุณาเลือก Gift Type และกรอกรายละเอียด')
        return
      }
    }
  
    // ✅ Validate discount_value สำหรับ FIXED และ PERCENTAGE
    if (formData.discount_type === 'FIXED' || formData.discount_type === 'PERCENTAGE') {
      if (!formData.discount_value || formData.discount_value <= 0) {
        alert('กรุณากรอก Discount Value ที่มากกว่า 0')
        return
      }
    }
  
    setLoading(true)
    try {
      let imageUrl = formData.image_url
      if (imageFile) imageUrl = await handleImageUpload(imageFile)
  
      // ✅ สร้าง payload โดยส่งเฉพาะฟิลด์ที่มีค่า
      const payload: Partial<CreateCouponInput> & {
        slug: string
        discount_type: DiscountType
        start_date: string | Date
        end_date: string | Date
        status: CouponStatus
      } = {
        slug: formData.slug.trim(),
        discount_type: formData.discount_type,
        start_date: formData.start_date,
        end_date: formData.end_date,
        status: formData.status ?? 'ACTIVE',
      }

      // Add optional fields only if they have values
      if (formData.code?.trim()) payload.code = formData.code.trim()
      if (formData.translations) payload.translations = formData.translations
      if (imageUrl) payload.image_url = imageUrl
      if (formData.min_amount && Number(formData.min_amount) > 0) {
        payload.min_amount = Number(formData.min_amount)
      }
      if (formData.max_discount && Number(formData.max_discount) > 0) {
        payload.max_discount = Number(formData.max_discount)
      }
      if (formData.usage_limit && Number(formData.usage_limit) > 0) {
        payload.usage_limit = Number(formData.usage_limit)
      }
  
      // ✅ เพิ่มฟิลด์ตาม discount_type
      if (formData.discount_type === 'BUY_X_GET_Y') {
        const buyQty = Number(formData.buy_quantity)
        const getQty = Number(formData.get_quantity)
        
        // Double check
        if (isNaN(buyQty) || isNaN(getQty)) {
          alert('❌ จำนวนไม่ถูกต้อง')
          setLoading(false)
          return
        }
        
        payload.buy_quantity = buyQty
        payload.get_quantity = getQty
      } else if (formData.discount_type === 'GIFT') {
        if (formData.gift_type) payload.gift_type = formData.gift_type
        if (formData.gift_details) payload.gift_details = formData.gift_details
      } else {
        // FIXED หรือ PERCENTAGE
        if (formData.discount_value && Number(formData.discount_value) > 0) {
          payload.discount_value = Number(formData.discount_value)
        }
      }
  
      console.log('📤 Sending payload:', JSON.stringify(payload, null, 2))
  
      const res = await axios.post('/api/coupons', payload)
      if (res.status === 201) {
        alert('✅ สร้างคูปองสำเร็จ!')
        // Reset form
        setFormData({
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
        setImageFile(null)
        setImagePreview(null)
        onClose()
      }
    } catch (err) {
      console.error('❌ Error:', err)
      if (axios.isAxiosError(err)) {
        const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message
        console.error('API Error Details:', err.response?.data)
        alert(`❌ สร้างคูปองไม่สำเร็จ: ${errorMsg}`)
      } else {
        alert('❌ สร้างคูปองไม่สำเร็จ')
      }
    } finally {
      setLoading(false)
    }
  }

  // ✅ Helper Components สำหรับ Gift Inputs
  const PopcornGiftInputs = () => {
    if (!isPopcornGift(formData.gift_details)) return null
    const details = formData.gift_details

    return (
      <>
        <input
          type="text"
          placeholder="Item"
          value={details.item}
          onChange={(e) =>
            handleChange('gift_details', {
              item: e.target.value,
              size: details.size,
            })
          }
          className="border border-blue-300 rounded-md p-3"
        />
        <input
          type="text"
          placeholder="Size"
          value={details.size ?? ''}
          onChange={(e) =>
            handleChange('gift_details', {
              item: details.item,
              size: e.target.value,
            })
          }
          className="border border-blue-300 rounded-md p-3"
        />
      </>
    )
  }

  const CouponCodeGiftInput = () => {
    if (!isCouponGift(formData.gift_details)) return null
    const details = formData.gift_details

    return (
      <input
        type="text"
        placeholder="Code"
        value={details.code}
        onChange={(e) =>
          handleChange('gift_details', {
            code: e.target.value,
          })
        }
        className="border border-blue-300 rounded-md p-3"
      />
    )
  }

  const OtherGiftInput = () => {
    if (!isOtherGift(formData.gift_details)) return null
    const details = formData.gift_details

    return (
      <input
        type="text"
        placeholder="Other Details"
        value={details.other}
        onChange={(e) =>
          handleChange('gift_details', {
            other: e.target.value,
          })
        }
        className="border border-blue-300 rounded-md p-3"
      />
    )
  }

  return (
    <ModalEmpty isShowModal={isShowModal} onClose={onClose}>
      <div className="bg-black w-[900px] rounded-md shadow-lg py-10 px-14 overflow-y-auto max-h-[90vh]">
        <h1 className="text-3xl font-bold text-white mb-2">Create Coupon</h1>
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {/* 🧾 Coupon Core Fields */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="font-semibold">Slug *</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                className="w-full border border-blue-300 rounded-md p-3 mt-1"
                required
              />
            </div>
            <div>
              <label className="font-semibold">Coupon Code</label>
              <input
                type="text"
                value={formData.code ?? ''}
                onChange={(e) => handleChange('code', e.target.value)}
                className="w-full border border-blue-300 rounded-md p-3 mt-1"
              />
            </div>
            <div>
              <label className="font-semibold">Discount Type *</label>
              <select
                value={formData.discount_type}
                onChange={(e) =>
                  handleChange('discount_type', e.target.value as DiscountType)
                }
                className="w-full border border-blue-300 rounded-md p-3 mt-1"
              >
                <option value="FIXED">Fixed</option>
                <option value="PERCENTAGE">Percentage</option>
                <option value="BUY_X_GET_Y">Buy X Get Y</option>
                <option value="GIFT">Gift</option>
              </select>
            </div>
            {formData.discount_type !== 'BUY_X_GET_Y' &&
              formData.discount_type !== 'GIFT' && (
                <div>
                  <label className="font-semibold">Discount Value</label>
                  <input
                    type="number"
                    value={formData.discount_value ?? ''}
                    onChange={(e) =>
                      handleChange('discount_value', Number(e.target.value))
                    }
                    className="w-full border border-blue-300 rounded-md p-3 mt-1"
                  />
                </div>
              )}
          </div>

          {/* 🧮 Dynamic Fields for BUY_X_GET_Y */}
          {formData.discount_type === 'BUY_X_GET_Y' && (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="font-semibold">Buy Quantity *</label>
                <input
                  type="number"
                  placeholder="Buy Quantity"
                  value={formData.buy_quantity ?? ''}
                  onChange={(e) =>
                    handleChange('buy_quantity', Number(e.target.value))
                  }
                  className="w-full border border-blue-300 rounded-md p-3 mt-1"
                  min="1"
                />
              </div>
              <div>
                <label className="font-semibold">Get Quantity *</label>
                <input
                  type="number"
                  placeholder="Get Quantity"
                  value={formData.get_quantity ?? ''}
                  onChange={(e) =>
                    handleChange('get_quantity', Number(e.target.value))
                  }
                  className="w-full border border-blue-300 rounded-md p-3 mt-1"
                  min="1"
                />
              </div>
            </div>
          )}

          {/* 🎁 Dynamic Fields for GIFT */}
          {formData.discount_type === 'GIFT' && (
            <div className="grid grid-cols-2 gap-6">
              <select
                value={formData.gift_type ?? ''}
                onChange={(e) =>
                  handleGiftTypeChange(e.target.value as GiftType)
                }
                className="border border-blue-300 rounded-md p-3"
              >
                <option value="">Select Gift Type</option>
                <option value="POPCORN">Popcorn</option>
                <option value="COUPON_CODE">Coupon Code</option>
                <option value="OTHER">Other</option>
              </select>

              {formData.gift_type === 'POPCORN' && <PopcornGiftInputs />}
              {formData.gift_type === 'COUPON_CODE' && <CouponCodeGiftInput />}
              {formData.gift_type === 'OTHER' && <OtherGiftInput />}
            </div>
          )}

          {/* 🌐 Translations */}
          <div className="grid grid-cols-2 gap-6">
            {(['en', 'th'] as const).map((lang) => (
              <div key={lang}>
                <label className="font-semibold">
                  Title ({lang.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={formData.translations?.[lang]?.name ?? ''}
                  onChange={(e) =>
                    handleTranslationChange(lang, 'name', e.target.value)
                  }
                  className="w-full border border-blue-300 rounded-md p-3 mt-1"
                />
                <label className="font-semibold mt-2">
                  Description ({lang.toUpperCase()})
                </label>
                <textarea
                  rows={3}
                  value={formData.translations?.[lang]?.description ?? ''}
                  onChange={(e) =>
                    handleTranslationChange(lang, 'description', e.target.value)
                  }
                  className="w-full border border-blue-300 rounded-md p-3 mt-1"
                />
              </div>
            ))}
          </div>

          {/* 📅 Dates + Status */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="font-semibold">Start Date *</label>
              <input
                type="date"
                value={formData.start_date as string}
                onChange={(e) => handleChange('start_date', e.target.value)}
                className="w-full border border-blue-300 rounded-md p-3 mt-1"
                required
              />
            </div>
            <div>
              <label className="font-semibold">End Date *</label>
              <input
                type="date"
                value={formData.end_date as string}
                onChange={(e) => handleChange('end_date', e.target.value)}
                className="w-full border border-blue-300 rounded-md p-3 mt-1"
                required
              />
            </div>
            <div>
              <label className="font-semibold">Status</label>
              <select
                value={formData.status ?? 'ACTIVE'}
                onChange={(e) =>
                  handleChange('status', e.target.value as CouponStatus)
                }
                className="w-full border border-blue-300 rounded-md p-3 mt-1"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="EXPIRED">Expired</option>
              </select>
            </div>
          </div>

          {/* 💰 Optional Fields */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="font-semibold">Min Amount</label>
              <input
                type="number"
                value={formData.min_amount ?? ''}
                onChange={(e) =>
                  handleChange('min_amount', Number(e.target.value))
                }
                className="w-full border border-blue-300 rounded-md p-3 mt-1"
              />
            </div>
            <div>
              <label className="font-semibold">Max Discount</label>
              <input
                type="number"
                value={formData.max_discount ?? ''}
                onChange={(e) =>
                  handleChange('max_discount', Number(e.target.value))
                }
                className="w-full border border-blue-300 rounded-md p-3 mt-1"
              />
            </div>
            <div>
              <label className="font-semibold">Usage Limit</label>
              <input
                type="number"
                value={formData.usage_limit ?? ''}
                onChange={(e) =>
                  handleChange('usage_limit', Number(e.target.value))
                }
                className="w-full border border-blue-300 rounded-md p-3 mt-1"
              />
            </div>
          </div>

          {/* 🖼 Image Upload */}
          <div>
            <label className="font-semibold">Coupon Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageSelect(e.target.files?.[0] ?? null)}
              className="mt-2"
            />
            {imagePreview && (
              <div className="mt-2 w-[150px] h-[150px] relative">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            )}
          </div>

          <Button className='cursor-pointer' type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Coupon'}
          </Button>
        </form>
      </div>
    </ModalEmpty>
  )
}

export default AdminCreateNewCouponForm