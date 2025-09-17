import CouponCard from '../Cards/CouponCard'

import React from 'react'
import { Button } from '../ui/button'

const Coupon = () => {
  return (
    <div className="flex w-screen justify-center item-center py-20  ">
      <div className="flex flex-col gap-10">
        <div className="flex justify-between items-center font-bold text-2xl py-1  ">
          <h2 className="headline-2">Special coupons</h2>
          <Button className="btn-base-transparent-underline-normal text-sm hover:underline">
            View all
          </Button>
        </div>
        <div className="lg:flex gap-5  grid grid-cols-2 ">
          <CouponCard title={'Minor Cineplex x COKE JOYFUL '} />
          <CouponCard title={'Redeem 999 UOB Rewards '} />
          <CouponCard title={'GSB Credit Cards (All Types) '} />
          <CouponCard title={'UOB Visa Infinite '} />
        </div>
      </div>
    </div>
  )
}

export default Coupon
