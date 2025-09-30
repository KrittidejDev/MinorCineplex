import CouponCard from '../Cards/CouponCard'
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import axios from 'axios'
import { APICoupon } from '@/types/coupon'

const CouponWidget = () => {
  const [coupons, setCoupons] = useState<APICoupon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoading(true)
        const res = await axios.get<{ coupons: APICoupon[] }>('/api/coupons')
        // ใช้แค่ 4 ตัวแรก
        setCoupons(res.data.coupons.slice(0, 4))
      } catch (err) {
        console.error(err)
        setError('ไม่สามารถโหลดคูปองได้')
      } finally {
        setLoading(false)
      }
    }

    fetchCoupons()
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

        {/* Grid / Flex */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:flex gap-5 justify-center">
          {coupons.map((coupon) => (
            <CouponCard
              key={coupon.id}
              coupon={{
                id: coupon.id,
                code: coupon.code,
                title_en: coupon.title_en,
                discount: coupon.discount_value,
                expiresAt: coupon.end_date ? new Date(coupon.end_date).toISOString() : null,
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
