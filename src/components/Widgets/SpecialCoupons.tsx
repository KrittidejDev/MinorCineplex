import React from 'react'
import CouponCard from '@/components/Cards/CouponCard'

const SpecialCoupons = () => {
 
  return (
    <>
      <div
        className="flex items-center font-bold py-1 px-10 w-full h-30 bg-[#070C1B] gap-6 lg:px-90 md:px-15
                text-base sm:text-lg md:text-xl lg:text-2xl
                flex-wrap md:flex-nowrap"
      >
        <div className="headline-3 border-b-2 border-[#8B93B0]">
          All coupons
        </div>
        <div className="headline-3 text-[#8B93B0]">UOB</div>
        <div className="headline-3 text-[#8B93B0]">Coke</div>
        <div className="headline-3 text-[#8B93B0]">KBank</div>
        <div className="headline-3 text-[#8B93B0]">GSB</div>
        <div className="headline-3 text-[#8B93B0]">AIS</div>
        <div className="headline-3 text-[#8B93B0]">Other</div>
      </div>

      <div className="w-dvw flex  justify-center item-center py-10 px-4 bg-blue-b">
        <div className="flex flex-col gap-10  max-w-[1200px]">
          <div className="lg:grid-cols-4 gap-5 md:grid-cols-3 md:gap-5 grid grid-cols-2 ">
            <CouponCard
              title={'Minor Cineplex x COKE JOYFUL '}
              
            />
            <CouponCard
              title={'Redeem 999 UOB Rewards '}
              
            />
            <CouponCard
              title={'GSB Credit Cards (All Types) '}
             
            />
            <CouponCard
              title={'UOB Visa Infinite '}
              
            />
            <CouponCard
              title={'Minor Cineplex x COKE JOYFUL '}
               
            />
            <CouponCard
              title={'Redeem 999 UOB Rewards '}
            
            />
            <CouponCard
              title={'GSB Credit Cards (All Types) '}
             
            />
            <CouponCard
              title={'UOB Visa Infinite '}
              
            />
          </div>
          {/* pagination */}
        </div>
      </div>
    </>
  )
}

export default SpecialCoupons
