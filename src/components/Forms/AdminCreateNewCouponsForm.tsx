import { useState } from 'react'
import ModalEmpty from '../Modals/ModalEmpty'
import { Button } from '../ui/button'
import axios from 'axios'
import Image from 'next/image'

interface CreateNewCouponFormProps {
  isShowModal: boolean
  onClose: () => void
}

function AdminCreateNewCouponForm({
  isShowModal,
  onClose,
}: CreateNewCouponFormProps) {
  const [formData, setFormData] = useState({
    code: '',
    title_en: '',
    title_th: '',
    discription_en: '',
    discription_th: '',
    discount_type: 'AMOUNT',
    discount_value: '',
    start_date: '',
    end_date: '',
    status: 'Active',
    min_amount: '',
    max_discount: '',
    usage_limit: '',
    image: null as File | null,
  })

  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleChange = (
    field: string,
    value: string | boolean | File | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // สร้าง preview สำหรับไฟล์รูปภาพ
    if (field === 'image' && value instanceof File) {
      const previewURL = URL.createObjectURL(value)
      setImagePreview(previewURL)
    } else if (field === 'image' && value === null) {
      setImagePreview(null)
    }
  }

  // ฟังก์ชันอัปโหลดไฟล์ไป /api/file-upload
  const handleImageUpload = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)

    const res = await axios.post('/api/file-upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    return res.data.url // ได้ url จาก Cloudinary
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.code ||
      !formData.discount_value ||
      !formData.start_date ||
      !formData.end_date
    ) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน')
      return
    }

    setLoading(true)
    try {
      let imageUrl = ''
      if (formData.image) {
        imageUrl = await handleImageUpload(formData.image)
      }

      const payload = {
        code: formData.code,
        title_en: formData.title_en,
        title_th: formData.title_th,
        discription_en: formData.discription_en,
        discription_th: formData.discription_th,
        discount_type: formData.discount_type,
        discount_value: Number(formData.discount_value),
        start_date: formData.start_date,
        end_date: formData.end_date,
        status: formData.status,
        min_amount: formData.min_amount ? Number(formData.min_amount) : null,
        max_discount: formData.max_discount
          ? Number(formData.max_discount)
          : null,
        usage_limit: formData.usage_limit ? Number(formData.usage_limit) : null,
        image: imageUrl,
      }

      const res = await axios.post('/api/coupons', payload)

      if (res.status === 201) {
        alert('✅ สร้างคูปองสำเร็จ!')
        onClose()
        setFormData({
          code: '',
          title_en: '',
          title_th: '',
          discription_en: '',
          discription_th: '',
          discount_type: 'AMOUNT',
          discount_value: '',
          start_date: '',
          end_date: '',
          status: 'Active',
          min_amount: '',
          max_discount: '',
          usage_limit: '',
          image: null,
        })
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
        <p className="text-gray-500 text-sm mb-8">
          Fill in the details below to create a new promotional coupon.
        </p>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {/* Coupon Code + Discount */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-blue-700 text-sm font-semibold">
                Coupon Code
              </label>
              <input
                type="text"
                placeholder="e.g SMR20PC"
                value={formData.code}
                onChange={(e) => handleChange('code', e.target.value)}
                className="w-full border border-blue-300 rounded-md p-3 mt-1 placeholder:text-gray-400 text-blue-700"
              />
            </div>
            <div>
              <label className="text-blue-700 text-sm font-semibold">
                Discount Value
              </label>
              <input
                type="number"
                placeholder="e.g 500"
                value={formData.discount_value}
                onChange={(e) => handleChange('discount_value', e.target.value)}
                className="w-full border border-blue-300 rounded-md p-3 mt-1 placeholder:text-gray-400 text-blue-700"
              />
            </div>
            <div>
              <label className="text-blue-700 text-sm font-semibold">
                Discount type
              </label>
              <select
                value={formData.discount_type}
                onChange={(e) => handleChange('discount_type', e.target.value)}
                className="w-full border border-blue-300 rounded-md p-3 mt-1 "
              >
                <option value="AMOUNT">Amount</option>
                <option value="PERCENT">Percent</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-blue-700 text-sm font-semibold">
                Title (EN)
              </label>
              <input
                type="text"
                placeholder="e.g. Summer Promotion"
                value={formData.title_en}
                onChange={(e) => handleChange('title_en', e.target.value)}
                className="w-full border border-blue-300 rounded-md p-3 mt-1 placeholder:text-gray-400 text-blue-700"
              />
            </div>
            <div>
              <label className="text-blue-700 text-sm font-semibold">
                Title (TH)
              </label>
              <input
                type="text"
                placeholder="เช่น โปรหน้าร้อน"
                value={formData.title_th}
                onChange={(e) => handleChange('title_th', e.target.value)}
                className="w-full border border-blue-300 rounded-md p-3 mt-1 placeholder:text-gray-400 text-blue-700"
              />
            </div>
          </div>

          {/* Description */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-blue-700 text-sm font-semibold">
                Description (EN)
              </label>
              <textarea
                placeholder="A brief description..."
                value={formData.discription_en}
                onChange={(e) => handleChange('discription_en', e.target.value)}
                className="w-full border border-blue-300 rounded-md p-3 mt-1 placeholder:text-gray-400 text-blue-700"
                rows={3}
              />
            </div>
            <div>
              <label className="text-blue-700 text-sm font-semibold">
                Description (TH)
              </label>
              <textarea
                placeholder="คำอธิบายโปรโมชั่น..."
                value={formData.discription_th}
                onChange={(e) => handleChange('discription_th', e.target.value)}
                className="w-full border border-blue-300 rounded-md p-3 mt-1 placeholder:text-gray-400 text-blue-700"
                rows={3}
              />
            </div>
          </div>

          {/* Date */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-blue-700 text-sm font-semibold">
                Start Date
              </label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => handleChange('start_date', e.target.value)}
                className="w-full border border-blue-300 rounded-md p-3 mt-1 text-blue-700"
              />
            </div>
            <div>
              <label className="text-blue-700 text-sm font-semibold">
                End Date
              </label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => handleChange('end_date', e.target.value)}
                className="w-full border border-blue-300 rounded-md p-3 mt-1 text-blue-700"
              />
            </div>
          </div>

          {/* Optional fields */}
          <div className="grid grid-cols-3 gap-6">
            <input
              type="number"
              placeholder="Min Amount"
              value={formData.min_amount}
              onChange={(e) => handleChange('min_amount', e.target.value)}
              className="w-full border border-blue-300 rounded-md p-3 mt-1 placeholder:text-gray-400 text-blue-700"
            />
            <input
              type="number"
              placeholder="Max Discount"
              value={formData.max_discount}
              onChange={(e) => handleChange('max_discount', e.target.value)}
              className="w-full border border-blue-300 rounded-md p-3 mt-1 placeholder:text-gray-400 text-blue-700"
            />
            <input
              type="number"
              placeholder="Usage Limit"
              value={formData.usage_limit}
              onChange={(e) => handleChange('usage_limit', e.target.value)}
              className="w-full border border-blue-300 rounded-md p-3 mt-1 placeholder:text-gray-400 text-blue-700" 
            />
          </div>

          {/* Image upload + preview */}
          <div>
            <label className="font-semibold">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleChange('image', e.target.files?.[0] ?? null)
              }
              className="mt-2 "
            />
            {imagePreview && (
              <div className="mt-3 w-48 h-48 relative border rounded-md overflow-hidden">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  style={{ objectFit: 'cover' }}
                />
                <button
                  type="button"
                  onClick={() => handleChange('image', null)}
                  className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Status */}
          <div className="flex items-center gap-3 mt-4">
            <label className="text-blue-700 text-sm font-semibold">
              Status
            </label>
            <div
              onClick={() =>
                handleChange(
                  'status',
                  formData.status === 'Active' ? 'inActive' : 'Active'
                )
              }
              className={`w-12 h-6 rounded-full flex items-center cursor-pointer transition ${
                formData.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transform transition ${
                  formData.status === 'Active'
                    ? 'translate-x-6'
                    : 'translate-x-1'
                }`}
              ></div>
            </div>
            <span className="text-sm text-gray-600">
              {formData.status === 'Active' ? 'Available' : 'Unavailable'}
            </span>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-10">
            <Button
              type="button"
              onClick={onClose}
              className="btn-base blue-normal cursor-pointer opacity-40 w-[120px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="btn-base blue-normal cursor-pointer w-[120px]"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </ModalEmpty>
  )
}

export default AdminCreateNewCouponForm
