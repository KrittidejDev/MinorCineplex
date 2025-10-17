import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { CouponCardData } from '@/types/coupon'
import { HoverCard3D } from '../Displays/HoverCard3D'
import { useSession } from 'next-auth/react'
import { userService } from '@/config/userServices'
import { toast } from 'react-toastify'

interface CouponCardProps {
  coupon: Pick<
    CouponCardData,
    'id' | 'code' | 'end_date' | 'title_en' | 'image'
  >
}

// 🔹 Define response types
interface CouponStatusResponse {
  coupon: CouponCardData
  collected?: boolean
  data?: {
    collected?: boolean
  }
}

const CouponCard = ({ coupon }: CouponCardProps) => {
  const router = useRouter()
  const { data: session } = useSession()
  const [collected, setCollected] = useState(false)
  const [loading, setLoading] = useState(false)

  // 🔹 Fetch latest coupon status ของ user
  useEffect(() => {
    if (!session?.user?.id) return

    const fetchUserCouponStatus = async () => {
      try {
        const response = (await userService.GET_COUPON_COLLECTED_BY_ID(
          coupon.id
        )) as CouponStatusResponse
        const isCollected = response?.collected
        setCollected(!!isCollected)
      } catch (err) {
        console.error('Failed to fetch user coupon status', err)
      }
    }

    fetchUserCouponStatus()
  }, [coupon.id, session?.user?.id])

  const handleClickCoupon = () => {
    router.push(`/coupons/${coupon.id}`)
  }

  const handleGetCoupon = async () => {
    if (!session?.user?.id) {
      toast.warning(
        <div>
          <strong>Please login</strong>
          <div>to collect coupon 🧾</div>
        </div>
      )
      return
    }

    setLoading(true)

    try {
      await userService.COLLECT_COUPON(coupon.id)
      setCollected(true)
      toast.success(
        <div>
          <strong>Coupon Claimed!</strong>
          <div>{`You can find it in the "My Coupons" menu`}</div>
        </div>
      )
    } catch (err) {
      console.error(err)
      const error = err as {
        response?: { data?: { error?: string } }
        message?: string
      }
      const errorMessage =
        error?.response?.data?.error ||
        error?.message ||
        'Failed to collect coupon ❌'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = () => {
    router.push(`/coupons/${coupon.id}`)
  }

  return (
    <HoverCard3D>
      <div className="w-full min-w-[161px] max-w-[285px] flex flex-col rounded-[8px] bg-[#070C1B]">
        <div
          className="w-full aspect-square rounded-t-[8px] overflow-hidden cursor-pointer"
          onClick={handleClickCoupon}
        >
          <Image
            src={coupon.image || ''}
            alt={coupon.title_en}
            width={285}
            height={285}
            className="w-full h-full object-cover rounded-t-[8px]"
          />
        </div>

        <div className="flex flex-col items-center gap-3 p-4">
          <div className="flex flex-col gap-2 items-start w-full">
            <h4
              className="text-[#FFFFFF] font-bold text-sm lg:text-xl line-clamp-2 hover:underline cursor-pointer w-full"
              onClick={handleClickCoupon}
            >
              {coupon.title_en}
            </h4>
            <div className="flex flex-col lg:flex-row gap-1 lg:gap-5 w-full text-xs lg:text-sm">
              <p className="text-[#8B93B0]">Valid until</p>
              <p className="text-[#8B93B0]">
                {coupon.end_date
                  ? new Date(coupon.end_date).toLocaleDateString('en-US', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })
                  : 'No expiration'}
              </p>
            </div>
          </div>

          <div className="w-full mt-2">
            {collected ? (
              <Button
                className="btn-base white-outline-normal w-full h-10 lg:h-12 text-xs lg:text-base"
                onClick={handleViewDetails}
              >
                View details
              </Button>
            ) : (
              <Button
                className="btn-base blue-normal w-full h-10 lg:h-12 text-xs lg:text-base"
                onClick={handleGetCoupon}
                disabled={loading}
              >
                {loading ? 'Collecting...' : 'Get coupon'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </HoverCard3D>
  )
}

export default CouponCard
