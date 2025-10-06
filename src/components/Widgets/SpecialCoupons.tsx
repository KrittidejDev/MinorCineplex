'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { userService } from '@/config/userServices'
import CouponCard from '@/components/Cards/CouponCard'
import {  APICoupon } from '@/types/coupon'


const categoryKeywords: { [key: string]: string[] } = {
  'UOB': ['UOB'],
  'Coke': ['COKE', 'Coke'],
  'KBank': ['KBANK', 'KBank'],
  'GSB': ['GSB'],
  'AIS': ['AIS'],
  'Other': []
}

const categories = ['All coupons', ...Object.keys(categoryKeywords)]

const SpecialCoupons = () => {
  const [coupons, setCoupons] = useState<APICoupon []>([])
  const [selectedCategory, setSelectedCategory] = useState('All coupons')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCollectedCoupons = async () => {
      try {
        setLoading(true)
        const res = await userService.GET_COUPON() as { coupons: APICoupon[] }
        console.log(res.coupons)
        setCoupons(res.coupons)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCollectedCoupons()
  }, [])

  const filteredCoupons = coupons.filter(coupon => {
    if (selectedCategory === 'All coupons') return true

    const keywords = categoryKeywords[selectedCategory]
    if (!keywords || keywords.length === 0) return true // Other category
    return keywords.some(keyword => coupon.code.includes(keyword))
  })

  return (
    <>
      <div className="flex items-center font-bold py-1 px-10 w-full h-30 bg-[#070C1B] gap-6 lg:px-90 md:px-15
                text-base sm:text-lg md:text-xl lg:text-2xl flex-wrap md:flex-nowrap">
        {categories.map(category => (
          <button
            key={category}
            className={`headline-3 px-2 py-1 ${
              category === selectedCategory ? 'border-b-2 border-[#8B93B0]' : 'text-[#8B93B0]'
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="w-dvw flex justify-center items-center py-10 px-4 bg-blue-b">
        <div className="flex flex-col gap-10 max-w-[1200px]">
          {loading ? (
            <p className="text-white text-center">Loading coupons...</p>
          ) : filteredCoupons.length > 0 ? (
            <div className="lg:grid-cols-4 gap-5 md:grid-cols-3 md:gap-5 grid grid-cols-2">
              {filteredCoupons.map(coupon => (
                <CouponCard
                  key={coupon.id}
                  coupon={{
                    id:coupon.id,
                    title_en: coupon.title_en,
                    code: coupon.code,
                    discount: coupon.discount_value,
                    expiresAt: coupon.end_date,
                    image: coupon.image
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

export default SpecialCoupons
