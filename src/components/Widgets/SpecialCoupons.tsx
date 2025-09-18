import React from 'react'
import CouponCard from "@/components/Cards/CouponCard";

const SpecialCoupons = () => {
  return (
    
     <div className="w-dvw flex justify-center item-center py-20 px-4 ">
      <div className="flex flex-col gap-10  max-w-[1200px]">
        <div className="flex gap-5 items-center font-bold text-f-24 py-1  ">
          <div >All coupons</div>
          <div className=''>UOB</div>
        </div>
        <div className="lg:grid-cols-4 gap-5 md:grid-cols-3 md:gap-5 grid grid-cols-2 ">
          <CouponCard title={'Minor Cineplex x COKE JOYFUL '} />
          <CouponCard title={'Redeem 999 UOB Rewards '} />
          <CouponCard title={'GSB Credit Cards (All Types) '} />
          <CouponCard title={'UOB Visa Infinite '} />
          <CouponCard title={'Minor Cineplex x COKE JOYFUL '} />
          <CouponCard title={'Redeem 999 UOB Rewards '} />
          <CouponCard title={'GSB Credit Cards (All Types) '} />
          <CouponCard title={'UOB Visa Infinite '} />
        </div>
      </div>
    </div>
  
  )
}

export default SpecialCoupons
