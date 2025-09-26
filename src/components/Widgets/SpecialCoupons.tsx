import React, { useState } from 'react'
import CouponCard from '@/components/Cards/CouponCard'

interface Coupon {
  code: string
  discount: number
  expiresAt: string
  category: string
}

const couponsData: Coupon[] = [
  { code: 'UOB2025', discount: 20, expiresAt: '2025-12-31T23:59:59.999Z', category: 'UOB' },
  { code: 'COKEJOY', discount: 15, expiresAt: '2025-11-30T23:59:59.999Z', category: 'Coke' },
  { code: 'KBANKOFF', discount: 10, expiresAt: '2025-10-31T23:59:59.999Z', category: 'KBank' },
  { code: 'GSBDEAL', discount: 25, expiresAt: '2025-12-15T23:59:59.999Z', category: 'GSB' },
  { code: 'AISBONUS', discount: 30, expiresAt: '2025-12-20T23:59:59.999Z', category: 'AIS' },
  { code: 'OTHER1', discount: 5, expiresAt: '2025-09-30T23:59:59.999Z', category: 'Other' },
]

const categories = ['All coupons', 'UOB', 'Coke', 'KBank', 'GSB', 'AIS', 'Other']

const SpecialCoupons = () => {
  const [selectedCategory, setSelectedCategory] = useState('All coupons')

  const filteredCoupons =
    selectedCategory === 'All coupons'
      ? couponsData
      : couponsData.filter((c) => c.category === selectedCategory)

  return (
    <>
      <div className="flex items-center font-bold py-1 px-10 w-full h-30 bg-[#070C1B] gap-6 lg:px-90 md:px-15
                text-base sm:text-lg md:text-xl lg:text-2xl flex-wrap md:flex-nowrap ">
        {categories.map((category) => (
          <div
            key={category}
            className={`headline-3 hover:cursor-pointer ${
              category === selectedCategory ? 'border-b-2 border-[#8B93B0]' : 'text-[#8B93B0]'
            }`}
            
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </div>
        ))}
      </div>

      <div className="w-dvw flex justify-center items-center py-10 px-4 bg-blue-b">
        <div className="flex flex-col gap-10 max-w-[1200px]">
          <div className="lg:grid-cols-4 gap-5 md:grid-cols-3 md:gap-5 grid grid-cols-2">
            {filteredCoupons.map((coupon) => (
              <CouponCard key={coupon.code} coupon={coupon} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default SpecialCoupons
