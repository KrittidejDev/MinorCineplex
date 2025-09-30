import CouponCard from '../Cards/CouponCard'
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import axios from 'axios'
import { CouponCardData, APICoupon } from '@/types/coupon'

// Type ของ coupon จาก API


const CouponWidget = () => {
  const [coupons, setCoupons] = useState<CouponCardData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoading(true)
        const res = await axios.get<{ coupons: APICoupon[] }>('/api/coupons')
        const firstFour: CouponCardData[] = res.data.coupons
          .slice(0, 4)
          .map((c) => ({
            id: c.id,
            code: c.code,
            title_en: c.title_en,
            title_th: c.title_th,
            discount: c.discountValue,
            expiresAt: c.endDate || undefined,
          }))
        setCoupons(firstFour)
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
        <div className="flex justify-between items-center font-bold text-2xl py-1">
          <h2 className="headline-2">Special coupons</h2>
          <Link href="/coupons" passHref>
            <Button className="btn-base-transparent-underline-normal text-sm hover:underline cursor-pointer">
              View all
            </Button>
          </Link>
        </div>
        <div className="lg:flex gap-5 md:grid-cols-3 md:gap-5 grid grid-cols-2">
          {coupons.map((coupon) => (
            <CouponCard
              key={coupon.id}
              coupon={{
                code: coupon.code,
                title_en: coupon.title_en,
                discount: coupon.discount,
                expiresAt: coupon.expiresAt,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default CouponWidget
