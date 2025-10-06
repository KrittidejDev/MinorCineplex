import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { CouponCardData } from '@/types/coupon'
import { HoverCard3D } from '../Displays/HoverCard3D'
import { useSession } from 'next-auth/react'
import { userService } from '@/config/userServices'

interface CouponCardProps {
  coupon: Pick<
    CouponCardData,
    'id' | 'code' | 'discount' | 'expiresAt' | 'title_en' | 'image'
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
        const response = (await userService.GET_COUPON_BY_ID(
          coupon.id
        )) as CouponStatusResponse
        console.log('res', response)
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
      alert('Please login to collect coupon')
      return
    }

    setLoading(true)

    try {
      await userService.COLLECT_COUPON(coupon.id)
      setCollected(true)
    } catch (err) {
      console.error(err)
      const error = err as {
        response?: { data?: { error?: string } }
        message?: string
      }
      const errorMessage =
        error?.response?.data?.error ||
        error?.message ||
        'Failed to collect coupon'
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = () => {
    router.push(`/coupons/${coupon.id}`)
  }

  return (
    <HoverCard3D>
      <div className="w-[161px] md:w-[285px] h-[337px] lg:w-[285px] lg:h-[477px] flex flex-col rounded-[8px] bg-[#070C1B]">
        <div
          className="h-[285px] w-full rounded-t-[8px] overflow-hidden cursor-pointer"
          onClick={handleClickCoupon}
        >
          <div className="relative w-full h-full">
            <Image
              src={coupon.image || ''}
              alt={coupon.title_en}
              width={285}
              height={285}
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
            {collected ? (
              <Button
                className="btn-base white-outline-normal lg:w-[237px] lg:h-[48px]"
                onClick={handleViewDetails}
              >
                View details
              </Button>
            ) : (
              <Button
                className="btn-base blue-normal lg:w-[237px] lg:h-[48px]"
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
