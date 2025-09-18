import React from 'react'
import { Button } from '../ui/button'

interface CouponCardProps {
  title: string
  onClick?: () => void
}

const CouponCard = ({ title, onClick }: CouponCardProps) => {
  return (
    <div 
      className="w-[161px] md:w-[285px] h-[337px] lg:w-[285px] lg:h-[477px] flex flex-col cursor-pointer rounded-[8px] bg-[#070C1B]"
    >
      <div className="h-[285px] bg-[#FFFFFF] rounded-t-[8px]">
        <img src="" alt={title} onClick={onClick}/>
      </div>
      <div className="flex flex-col flex-1 items-center gap-y-9 p-4">
        <div className="flex flex-col mt-3 gap-3 items-start">
          <h4 className="headline-4 text-[#FFFFFF] font-bold text-xl line-clamp-2" onClick={onClick}>{title}</h4>
          <div className="flex gap-5">
            <p className="text-sm text-[#8B93B0]">Valid until</p>
            <p className="text-sm text-[#8B93B0]">31 Dec 2024</p>
          </div>
        </div>
        <div>
          <Button className="btn-base blue-normal lg:w-[237px] lg:h-[48px]">Get coupon</Button>
        </div>
      </div>
    </div>
  )
}

export default CouponCard
