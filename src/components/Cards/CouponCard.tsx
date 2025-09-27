import React from 'react'
import { Button } from '../ui/button'
import { useRouter } from 'next/router'
import Image from 'next/image'
interface Coupon {
  code: string
  discount: number
  expiresAt?: string // ISO string
}

interface CouponCardProps {
  coupon: Coupon
}

const CouponCard = ({ coupon }: CouponCardProps) => {
  const router = useRouter()

  const handleClickCoupon = () => {
    router.push(`/coupons/${coupon.code}`) // ใช้ code เป็น identifier
  }

  return (
    <div className="w-[161px] md:w-[285px] h-[337px] lg:w-[285px] lg:h-[477px] flex flex-col rounded-[8px] bg-[#070C1B]">
      <div
        className="h-[285px] bg-[#FFFFFF] rounded-t-[8px] cursor-pointer"
        onClick={handleClickCoupon}
      >
        <div className="relative w-20 h-20 mx-auto mt-4">
          <Image
            src="/images/coupon.png" // ต่อไปอาจเปลี่ยนเป็น coupon.image
            alt={coupon.code}
            fill
            className="object-contain"
          />
        </div>
      </div>
      <div className="flex flex-col flex-1 items-center gap-y-9 p-4">
        <div className="flex flex-col mt-3 gap-3 items-start">
          <h4
            className="headline-4 text-[#FFFFFF] font-bold text-xl line-clamp-2 hover:underline cursor-pointer"
            onClick={handleClickCoupon}
          >
            {coupon.code}
          </h4>
          <div className="flex gap-5">
            <p className="text-sm text-[#8B93B0]">Valid until</p>
            <p className="text-sm text-[#8B93B0]">
              {coupon.expiresAt
                ? new Date(coupon.expiresAt).toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })
                : 'No expiration'}
            </p>
          </div>
        </div>
        <div>
          <Button className="btn-base blue-normal lg:w-[237px] lg:h-[48px]">
            Get coupon
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CouponCard
