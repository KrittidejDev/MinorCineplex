import React from 'react'
import { Button } from '../ui/button'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { CouponCardData } from '@/types/coupon'

interface CouponCardProps {
  coupon: Pick<
    CouponCardData,
    'id' | 'code' | 'discount' | 'expiresAt' | 'title_en' | 'image'
  >
}

const CouponCard = ({ coupon }: CouponCardProps) => {
  const router = useRouter()

  const handleClickCoupon = () => {
    router.push(`/coupons/${coupon.id}`)
  }

  return (
    <div className="w-[161px] md:w-[285px] h-[337px] lg:w-[285px] lg:h-[477px] flex flex-col rounded-[8px] bg-[#070C1B]">
      <div
        className="h-[285px] w-full  rounded-t-[8px] overflow-hidden cursor-pointer"
        onClick={handleClickCoupon}
      >
        <div className="relative w-full h-full">
          <Image
            src={coupon.image ?? '/default-image.svg'}
            alt={coupon.title_en}
            width={285} // width ของ container บน desktop
            height={285} // height เท่ากับ width → square
            className="rounded-t-[8px]"
          />
        </div>
      </div>

      <div className="flex flex-col flex-1 items-center gap-y-9 p-4">
        <div className="flex flex-col mt-3 gap-3 items-start">
          <h4
            className="headline-4 text-[#FFFFFF] font-bold text-xl line-clamp-2 hover:underline cursor-pointer"
            onClick={handleClickCoupon}
          >
            {coupon.title_en}
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
