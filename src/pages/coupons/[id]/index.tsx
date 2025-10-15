// pages/coupons/[id]/index.tsx
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import NavAndFooter from '@/components/MainLayout/NavAndFooter'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { APICoupon } from '@/types/coupon'
import { userService } from '@/config/userServices'
import { useSession } from 'next-auth/react'
import { HoverCard3D } from '@/components/Displays/HoverCard3D'

interface CouponStatusResponse {
  coupon: APICoupon
  is_collected: boolean
}

const CouponDetail = () => {
  const router = useRouter()
  const { id } = router.query
  const [coupon, setCoupon] = useState<APICoupon | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [collected, setCollected] = useState(false)
  const { data: session } = useSession()

  // Format วันแบบ memoized
  const formatDate = useCallback((isoDate?: string | null): string => {
    if (!isoDate) return 'N/A'
    const date = new Date(isoDate)
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }, [])

  // Fetch coupon จาก backend (UUID string)
  const fetchCoupon = useCallback(async (couponId: string) => {
    try {
      setLoading(true)
      const res = (await userService.GET_COUPON_BY_ID(couponId)) as CouponStatusResponse
      if (res?.coupon) {
        setCoupon(res.coupon)
        setCollected(Boolean(res.is_collected))
      } else {
        throw new Error('Coupon not found')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Cannot load coupon'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  // useEffect ดึงข้อมูลเมื่อ router.query.id พร้อม
  useEffect(() => {
    if (!id) return
    const couponId = Array.isArray(id) ? id[0] : id
    fetchCoupon(couponId).catch(console.error)
  }, [id, fetchCoupon])

  // Handle กดเก็บคูปอง
  const handleGetCoupon = useCallback(async () => {
    if (!session?.user?.id) {
      alert('Please login to collect coupon')
      return
    }
    if (!coupon) {
      alert('Coupon not found')
      return
    }

    try {
      setLoading(true)
      await userService.COLLECT_COUPON(coupon.id)
      setCollected(true)
    } catch (err) {
      console.error(err)
      const error = err as { response?: { data?: { error?: string } }; message?: string }
      const errorMessage =
        error?.response?.data?.error || error?.message || 'Failed to collect coupon'
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [coupon, session])

  // Memoized วันหมดอายุ
  const formattedEndDate = useMemo(
    () => formatDate(coupon?.end_date),
    [coupon?.end_date, formatDate]
  )

  // Loading / Error / Not Found
  if (loading)
    return (
      <NavAndFooter>
        <div className="text-center py-10 animate-pulse text-gray-400">
          Loading coupon...
        </div>
      </NavAndFooter>
    )

  if (error)
    return (
      <NavAndFooter>
        <p className="text-center text-red-400 py-10">{error}</p>
      </NavAndFooter>
    )

  if (!coupon)
    return (
      <NavAndFooter>
        <p className="text-center py-10">Coupon not found</p>
      </NavAndFooter>
    )

  return (
    <NavAndFooter>
      <div className="flex flex-col lg:flex-row items-start justify-center w-full min-h-screen px-4 sm:px-6 lg:px-8 py-6 lg:py-12 gap-6 lg:gap-8 lg:max-w-[1200px]">
        {/* Left Side - Image */}
        <div className="w-full lg:w-[387px] xl:w-[387px] lg:flex-shrink-0">
          <HoverCard3D>
            <Image
              src={coupon.image || '/default-image.svg'}
              alt={coupon.title_en}
              width={387}
              height={387}
              className="rounded-lg w-full h-auto"
              priority
            />
          </HoverCard3D>
        </div>

        {/* Right Side - Content */}
        <div className="w-full  bg-[#070C1B] rounded-lg p-5 sm:p-6 lg:p-10 xl:p-12 flex flex-col gap-5 lg:gap-6 lg:items-start">
          {/* Title & Date */}
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-2xl xl:text-3xl font-bold text-white mb-3 lg:mb-4 leading-tight">
              {coupon.title_en}
            </h1>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <p className="text-[#8B93B0] text-sm lg:text-base">Valid until</p>
              <p className="text-white text-sm lg:text-base">{formattedEndDate}</p>
            </div>
          </div>

          {/* Button */}
          <Button
            className={`w-full sm:w-auto sm:min-w-[200px] h-12 text-base font-semibold rounded-lg transition-all ${
              collected 
                ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
            onClick={!collected && !loading ? handleGetCoupon : undefined}
            disabled={collected || loading}
          >
            {loading ? 'Collecting...' : collected ? 'Coupon Saved' : 'Get coupon'}
          </Button>

          {/* Description */}
          <div className="text-white text-sm sm:text-base space-y-3">
            <p className="leading-relaxed">{coupon.discription_en || '—'}</p>
            <div className="space-y-2">
              <p className="flex items-start gap-2">
                <span className="flex-shrink-0">📅</span>
                <span>Sales Period: Jan 4 – Mar 31, 2025</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="flex-shrink-0">🎟</span>
                <span>Redemption Period: Jan 4 – Jun 30, 2025</span>
              </p>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="text-white text-sm sm:text-base">
            <p className="font-semibold mb-3 text-base sm:text-lg">Terms & Conditions</p>
            <ul className="space-y-2 pl-5">
              <li className="list-disc leading-relaxed">Valid for a minimum purchase of 400 THB.</li>
              <li className="list-disc leading-relaxed">Applicable for Deluxe and Premium seats.</li>
              <li className="list-disc leading-relaxed">Cannot be combined with other offers or exchanged for cash.</li>
              <li className="list-disc leading-relaxed">Non-refundable and non-transferable.</li>
            </ul>
          </div>
        </div>
      </div>
    </NavAndFooter>
  )
}

export default React.memo(CouponDetail)