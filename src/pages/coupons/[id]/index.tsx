import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import NavAndFooter from '@/components/MainLayout/NavAndFooter'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { APICoupon } from '@/types/coupon'

const CouponDetail = () => {
  const router = useRouter()
  const { id } = router.query
  const [coupon, setCoupon] = useState<APICoupon | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    // แปลง id ให้เป็น number
    const couponId = Array.isArray(id)
      ? parseInt(id[0])
      : parseInt(id as string)
    if (isNaN(couponId)) {
      setError('Invalid coupon id')
      setLoading(false)
      return
    }

    const fetchCoupon = async () => {
      try {
        const res = await fetch(`/api/coupons/${couponId}`)
        if (!res.ok) throw new Error('Coupon not found')
        const data = await res.json()
        setCoupon(data.coupon)
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message)
        else setError('Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchCoupon()
  }, [id])

  if (loading)
    return (
      <NavAndFooter>
        <p>Loading...</p>
      </NavAndFooter>
    )
  if (error)
    return (
      <NavAndFooter>
        <p>{error}</p>
      </NavAndFooter>
    )
  if (!coupon)
    return (
      <NavAndFooter>
        <p>Coupon not found</p>
      </NavAndFooter>
    )
  return (
    <NavAndFooter>
      <div className="flex flex-col lg:flex-row items-center lg:items-start w-full min-h-screen px-4 sm:px-8 lg:px-130 py-6 lg:py-30 gap-5">
        {/* Left Side - Image */}
        <div className="flex justify-center lg:justify-start w-full lg:w-[387px]">
          <Image
            src={coupon.image || '/default-image.svg'}
            alt={coupon.title_en}
            width={387}
            height={387} // square
            className="rounded-t-[8px] w-full h-auto"
            priority
          />
        </div>

        {/* Right Side - Content */}
        <div className="w-full lg:w-2/3 h-auto lg:h-full bg-[#070C1B] rounded-[6px] p-6 sm:p-10 gap-10 lg:p-13 flex flex-col lg:gap-20">
          {/* Title */}
          <div className="w-full">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">
              Minor Cineplex x COKE JOYFUL TOGETHER PACKAGE: Great Deal for Only
              999 THB!
            </h1>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-5">
              <p className="text-[#8B93B0] text-sm sm:text-base">Valid until</p>
              <p className="text-white text-sm sm:text-base">31 Dec 2024</p>
            </div>
          </div>

          {/* Button */}
          <div>
            <Button className="btn-base blue-normal">Get coupon</Button>
          </div>
          <div>
            <p>
              6 Movie Vouchers (Deluxe, Bench at all branches & Premium) 6 Soft
              Drink Vouchers (44 oz.)
            </p>
            <p>📅 Sales Period: Jan 4 – Mar 31, 2025</p>
            <p>🎟 Redemption Period: Jan 4 – Jun 30, 2025</p>
          </div>
          {/* Details */}
          <div className="text-white w-full flex flex-col gap-2 text-sm sm:text-base">
            <div>
              <p className="mt-3 font-semibold">Terms & Conditions</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Valid for a minimum purchase of 400 THB.</li>
                <li>
                  Applicable for Deluxe seats at all branches and Premium seats.
                </li>
                <li>Valid from January 4, 2025 – June 30, 2025, only.</li>
                <li>Resale for commercial purposes is not allowed.</li>
                <li>Non-transferable to others.</li>
                <li>
                  Cannot be combined with other discounts or promotional offers.
                </li>
                <li>Cannot be exchanged or redeemed for cash.</li>
                <li>
                  Non-refundable and cannot be canceled under any circumstances.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </NavAndFooter>
  )
}

export default CouponDetail
