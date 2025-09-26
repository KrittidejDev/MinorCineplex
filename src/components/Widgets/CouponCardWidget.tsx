import CouponCard from '../Cards/CouponCard'
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'

interface Coupon {
  code: string
  discount: number
  expiresAt: string
}

const couponsData: Coupon[] = [
  { code: 'Minor Cineplex x COKE JOYFUL ', discount: 10, expiresAt: '2025-12-31T23:59:59.999Z' },
  { code: 'Redeem 999 UOB Rewards', discount: 20, expiresAt: '2025-11-30T23:59:59.999Z' },
  { code: 'GSB Credit Cards (All Types)', discount: 15, expiresAt: '2025-10-31T23:59:59.999Z' },
  { code: 'UOB Visa Infinite ', discount: 25, expiresAt: '2025-12-15T23:59:59.999Z' },
]

const CouponWidget = () => {
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
          {couponsData.map((coupon) => (
            <CouponCard key={coupon.code} coupon={coupon} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default CouponWidget
