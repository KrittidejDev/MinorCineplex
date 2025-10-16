
import CouponCard from '../Cards/CouponCard'
import React, { useEffect, useState, useCallback } from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import axios from 'axios'
import { APICoupon } from '@/types/coupon'

const CouponWidget = () => {
  const [coupons, setCoupons] = useState<APICoupon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

// ใช้ useCallback ป้องกันสร้าง function ซ้ำตอน re-render
const fetchCoupons = useCallback(async (isMounted: { current: boolean }) => {
  try {
    if (isMounted.current) setLoading(true)
    const res = await axios.get<{ coupons: APICoupon[] }>('/api/coupons')
    if (isMounted.current) setCoupons(res.data.coupons.slice(0, 4)) // ใช้แค่ 4 ตัวแรก
  } catch (err) {
    console.error(err)
    if (isMounted.current) setError('ไม่สามารถโหลดคูปองได้')
  } finally {
    if (isMounted.current) setLoading(false)
  }
}, [])

// useEffect เรียก fetchCoupons
useEffect(() => {
  const isMounted = { current: true }
  fetchCoupons(isMounted).catch(console.error)

  return () => {
    isMounted.current = false
  }
}, [fetchCoupons])

// ใช้ useCallback เพื่อ memoize function
const formatDate = useCallback((isoDate?: string | null) => {
  if (!isoDate) return 'N/A'
  return new Date(isoDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}, [])

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>

  return (
    <div className="w-dvw flex justify-center items-center py-20 px-4">
      <div className="flex flex-col gap-10 max-w-[1200px]">
        {/* Header */}
        <div className="flex justify-between items-center font-bold text-2xl py-1">
          <h2 className="headline-2">Special coupons</h2>
          <Link href="/coupons" passHref>
            <Button className="btn-base-transparent-underline-normal text-sm hover:underline cursor-pointer">
              View all
            </Button>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:flex gap-5 justify-center">
          {coupons.map((coupon) => (
            <CouponCard
              key={coupon.id}
              coupon={{
                id: coupon.id,
                code: coupon.code,
                title_en: coupon.title_en,
                end_date: formatDate(coupon.end_date),
                image: coupon.image,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default CouponWidget
