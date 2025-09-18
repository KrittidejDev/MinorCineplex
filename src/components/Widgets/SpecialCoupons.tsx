import React from 'react'
import CouponCard from '@/components/Cards/CouponCard'
import { useRouter } from 'next/router'
const SpecialCoupons = () => {
  const router = useRouter()
  const handleClickcoupon = (id: string) => {
    router.push(`/coupons/${id}`)
  }
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
              onClick={() => handleClickcoupon('coke-joyful')}
            />
            <CouponCard
              title={'Redeem 999 UOB Rewards '}
              onClick={() => handleClickcoupon('uob-rewards')}
            />
            <CouponCard
              title={'GSB Credit Cards (All Types) '}
              onClick={() => handleClickcoupon('gsb')}
            />
            <CouponCard
              title={'UOB Visa Infinite '}
              onClick={() => handleClickcoupon('uob-visa-infinite')}
            />
            <CouponCard
              title={'Minor Cineplex x COKE JOYFUL '}
              onClick={() => handleClickcoupon('coke-joyful')}
            />
            <CouponCard
              title={'Redeem 999 UOB Rewards '}
              onClick={() => handleClickcoupon('uob-rewards')}
            />
            <CouponCard
              title={'GSB Credit Cards (All Types) '}
              onClick={() => handleClickcoupon('gsb')}
            />
            <CouponCard
              title={'UOB Visa Infinite '}
              onClick={() => handleClickcoupon('uob-visa-infinite')}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default SpecialCoupons
