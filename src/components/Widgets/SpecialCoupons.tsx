
import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { userService } from '@/config/userServices'
import CouponCard from '@/components/Cards/CouponCard'
import { APICoupon } from '@/types/coupon'

const categoryKeywords: Record<string, string[]> = {
  UOB: ['UOB'],
  Coke: ['COKE', 'Coke'],
  KBank: ['KBANK', 'KBank'],
  GSB: ['GSB'],
  AIS: ['AIS'],
  Other: [],
}

const categories = ['All coupons', ...Object.keys(categoryKeywords)]

const SpecialCoupons = () => {
  const [coupons, setCoupons] = useState<APICoupon[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All coupons')
  const [loading, setLoading] = useState(true)

  // ✅ ดึงข้อมูลแค่ครั้งเดียว
  useEffect(() => {
    let isMounted = true
    const fetchCoupons = async () => {
      try {
        const res = (await userService.GET_COUPON()) as { coupons: APICoupon[] }
        if (isMounted) setCoupons(res.coupons || [])
      } catch (err) {
        console.error('❌ Failed to fetch coupons:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchCoupons()
    return () => {
      isMounted = false
    }
  }, [])

  // ✅ ใช้ useMemo เพื่อไม่ให้ filter คำนวณใหม่ทุกครั้งที่ render
  const filteredCoupons = useMemo(() => {
    if (selectedCategory === 'All coupons') return coupons
    const keywords = categoryKeywords[selectedCategory] || []
    if (keywords.length === 0) return coupons.filter(c => !Object.values(categoryKeywords).flat().some(k => c.code.includes(k)))
    return coupons.filter(coupon => keywords.some(keyword => coupon.code.includes(keyword)))
  }, [coupons, selectedCategory])

  // ✅ ใช้ useCallback ป้องกัน re-render ของปุ่มทั้งหมด
  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category)
  }, [])

  return (
    <>
      {/* 🔹 Category Tabs */}
      <div
        className="flex items-center font-bold py-1 px-10 w-full h-30 bg-[#070C1B] gap-6 lg:px-90 md:px-15
        text-base sm:text-lg md:text-xl lg:text-2xl flex-wrap md:flex-nowrap overflow-x-auto scrollbar-hide"
      >
        {categories.map(category => (
          <button
            key={category}
            className={`headline-3 px-2 py-1 whitespace-nowrap transition-colors duration-200 cursor-pointer  ${
              category === selectedCategory
                ? 'border-b-2 border-[#8B93B0] text-white'
                : 'text-[#8B93B0] hover:text-white'
            }`}
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 🔹 Coupon Grid */}
      <div className="w-full flex justify-center items-center py-10 px-4 bg-blue-b">
        <div className="flex flex-col gap-10 max-w-[1200px] w-full">
          {loading ? (
            <p className="text-white text-center">Loading coupons...</p>
          ) : filteredCoupons.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredCoupons.map(coupon => (
                <CouponCard
                  key={coupon.id}
                  coupon={{
                    id: coupon.id,
                    title_en: coupon.title_en,
                    code: coupon.code,
                    end_date: coupon.end_date,
                    image: coupon.image,
                  }}
                />
              ))}
            </div>
          ) : (
            <p className="text-white text-center">No coupons found.</p>
          )}
        </div>
      </div>
    </>
  )
}

export default React.memo(SpecialCoupons)
