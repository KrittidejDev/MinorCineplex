//components/CouponCard.tsx
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
    'id' | 'code' | 'end_date' | 'translations' | 'image_url'
  >
}

interface CouponStatusResponse {
  coupon: CouponCardData
  collected?: boolean
  data?: { collected?: boolean }
}

const CouponCard = ({ coupon }: CouponCardProps) => {
  const router = useRouter()
  const { data: session } = useSession()
  const [collected, setCollected] = useState(false)
  const [loading, setLoading] = useState(false)

  // Get current locale from router (default to 'en')
  const locale = router.locale || 'en'

  // Get title based on current locale
  const title = coupon.translations?.[locale as 'en' | 'th']?.name || 
                coupon.translations?.en?.name || 
                'No title'

  useEffect(() => {
    if (!session?.user?.id) return

    const fetchUserCouponStatus = async () => {
      try {
        const response = (await userService.GET_COUPON_COLLECTED_BY_ID(
          coupon.id
        )) as CouponStatusResponse
        setCollected(!!response?.collected)
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
          <strong>{locale === 'th' ? 'กรุณาเข้าสู่ระบบ' : 'Please login'}</strong>
          <div>{locale === 'th' ? 'เพื่อรับคูปอง 🧾' : 'to collect coupon 🧾'}</div>
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
          <strong>{locale === 'th' ? 'รับคูปองสำเร็จ!' : 'Coupon Claimed!'}</strong>
          <div>
            {locale === 'th' 
              ? 'คุณสามารถดูได้ในเมนู "คูปองของฉัน"' 
              : 'You can find it in the "My Coupons" menu'}
          </div>
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
        (locale === 'th' ? 'รับคูปองไม่สำเร็จ ❌' : 'Failed to collect coupon ❌')
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = () => {
    router.push(`/coupons/${coupon.id}`)
  }

  // Localized text
  const validUntilText = locale === 'th' ? 'ใช้ได้ถึง' : 'Valid until'
  const noExpirationText = locale === 'th' ? 'ไม่มีวันหมดอายุ' : 'No expiration'
  const viewDetailsText = locale === 'th' ? 'ดูรายละเอียด' : 'View details'
  const getCouponText = locale === 'th' ? 'รับคูปอง' : 'Get coupon'
  const collectingText = locale === 'th' ? 'กำลังรับ...' : 'Collecting...'

  return (
    <HoverCard3D>
      <div className="w-full min-w-[161px] max-w-[285px] flex flex-col rounded-[8px] bg-[#070C1B]">
        <div
          className="w-full aspect-square rounded-t-[8px] overflow-hidden cursor-pointer"
          onClick={handleClickCoupon}
        >
          <Image
            src={coupon.image_url || ''}
            alt={title}
            width={285}
            height={285}
            className="w-full h-full object-cover object-center rounded-t-[8px]"
          />
        </div>

        <div className="flex flex-col items-center gap-3 p-4">
          <div className="flex flex-col gap-2 items-start w-full">
            <h4
              className="text-[#FFFFFF] leading-[1.25em] min-h-[2.5em] font-bold text-sm lg:text-xl line-clamp-2 hover:underline cursor-pointer w-full"
              onClick={handleClickCoupon}
            >
              {title}
            </h4>
            <div className="flex flex-col lg:flex-row gap-1 lg:gap-5 w-full text-xs lg:text-sm">
              <p className="text-[#8B93B0]">{validUntilText}</p>
              <p className="text-[#8B93B0]">
                {coupon.end_date
                  ? new Date(coupon.end_date).toLocaleDateString(
                      locale === 'th' ? 'th-TH' : 'en-US',
                      {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      }
                    )
                  : noExpirationText}
              </p>
            </div>
          </div>

          <div className="w-full mt-2">
            {collected ? (
              <Button
                className="btn-base white-outline-normal w-full h-10 lg:h-12 text-xs lg:text-base"
                onClick={handleViewDetails}
              >
                {viewDetailsText}
              </Button>
            ) : (
              <Button
                className="btn-base blue-normal w-full h-10 lg:h-12 text-xs lg:text-base cursor-pointer"
                onClick={handleGetCoupon}
                disabled={loading}
              >
                {loading ? collectingText : getCouponText}
              </Button>
            )}
          </div>
        </div>
      </div>
    </HoverCard3D>
  )
}

export default CouponCard