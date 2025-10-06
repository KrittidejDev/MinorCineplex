import React, { useEffect, useState } from 'react'
import NavBarWidget from '@/components/Widgets/NavBarWidget'
import ProfileBar from '@/components/Widgets/ProfileBar'
import CouponCard from '@/components/Cards/CouponCard'
import { CouponCardData, APICoupon } from '@/types/coupon'
import axios from 'axios'

const ProfileMycoupons = () => {
  const [coupons, setCoupons] = useState<CouponCardData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoading(true)
        const res = await axios.get<{ coupons: APICoupon[] }>('/api/coupons')
        const apiCoupons: APICoupon[] = res.data.coupons

        // แปลง APICoupon → CouponCardData
        const cardData: CouponCardData[] = apiCoupons.map((c: APICoupon) => ({
          id: c.id,
          code: c.code,
          title_en: c.title_en,
          title_th: c.title_th,
          discount: c.discount_value,
          expiresAt: c.end_date ?? null,
          image: c.image,
        }))

        setCoupons(cardData)
      } catch (err) {
        console.error(err)
        setError('ไม่สามารถโหลดคูปองได้')
      } finally {
        setLoading(false)
      }
    }

    fetchCoupons()
  }, [])

  if (loading) return <p className="text-center py-10">Loading...</p>
  if (error) return <p className="text-center py-10">{error}</p>
  return (
    <div className="bg-blue-b flex flex-col min-h-[100dvh]">
      <NavBarWidget />
      <div className="flex-1">
        <div
          className="
            flex flex-col md:flex-row 
            items-start justify-start 
            pt-10 md:pt-20 
            px-5 md:px-10 lg:px-100 
            h-full gap-6 md:gap-10
          "
        >
          {/* ProfileBar */}
          <div className="w-full  md:w-1/4 lg:min-w-[250px]">
            <ProfileBar />
          </div>

          {/* Content - Full Width Container */}
          <div className="flex flex-col items-start justify-start gap-y-5 w-full md:w-3/4 lg:w-4/5 px-0 md:px-0 lg:px-40">
            <div className="text-f-24 md:text-f-28 lg:text-f-36 px-0 md:px-0 lg:px-0">
              My coupons
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-2  gap-y-10 w-full lg:w-2xl px-0 md:px-0 lg:px-0">
            {coupons.map((coupon) => (
                <CouponCard key={coupon.id} coupon={coupon} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileMycoupons
