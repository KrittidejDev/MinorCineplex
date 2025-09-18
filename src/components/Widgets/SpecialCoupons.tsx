import React from 'react'
import CouponCard from "@/components/Cards/CouponCard";
import { useRouter } from 'next/router';
const SpecialCoupons = () => {
    const router = useRouter();
    const handleClickcoupon = (id) => {
    router.push(`/coupons/${id}`);
  };
  return (
    
     <div className="w-dvw flex justify-center item-center py-20 px-4 ">
      <div className="flex flex-col gap-10  max-w-[1200px]">
        <div className="flex gap-5 items-center font-bold text-f-24 py-1  ">
          <div >All coupons</div>
          <div className='text-[#8B93B0]'>UOB</div>
          <div className='text-[#8B93B0]'>Coke</div>
          <div className='text-[#8B93B0]'>KBank</div>
          <div className='text-[#8B93B0]'>GSB</div>
          <div className='text-[#8B93B0]'>AIS</div>
          <div className='text-[#8B93B0]'>Other</div>
        </div>
        <div className="lg:grid-cols-4 gap-5 md:grid-cols-3 md:gap-5 grid grid-cols-2 ">
          <CouponCard title={'Minor Cineplex x COKE JOYFUL '} onClick={() => handleClickcoupon("coke-joyful")}/>
          <CouponCard title={'Redeem 999 UOB Rewards '} onClick={() => handleClickcoupon("uob-rewards")} />
          <CouponCard title={'GSB Credit Cards (All Types) '} onClick={() => handleClickcoupon("gsb")}/>
          <CouponCard title={'UOB Visa Infinite '} onClick={() => handleClickcoupon("uob-visa-infinite")} />
          <CouponCard title={'Minor Cineplex x COKE JOYFUL '} onClick={() => handleClickcoupon("coke-joyful")}/>
          <CouponCard title={'Redeem 999 UOB Rewards '} onClick={() => handleClickcoupon("uob-rewards")}/>
          <CouponCard title={'GSB Credit Cards (All Types) '} onClick={() => handleClickcoupon("gsb")}/>
          <CouponCard title={'UOB Visa Infinite '} onClick={() => handleClickcoupon("uob-visa-infinite")}/>
        </div>
      </div>
    </div>
  
  )
}

export default SpecialCoupons
