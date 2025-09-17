import React from 'react'

interface CouponCardProps {
        title: string;
    }
const CouponCard = ({title}:CouponCardProps) => {
  return (
    <div className="w-[285px] h-[477px] flex flex-col cursor-pointer rounded-[4px] bg-[#070C1B]">
      <div className="h-[285px] bg-[#FFFFFF] ">
        <img src="" alt={title} />
      </div>
    </div>
  )
}

export default CouponCard
