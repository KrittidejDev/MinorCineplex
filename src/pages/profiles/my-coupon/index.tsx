
import React, { useEffect, useState, useCallback } from 'react'
import NavBarWidget from '@/components/Widgets/NavBarWidget'
import ProfileBar from '@/components/Widgets/ProfileBar'
import CouponCard from '@/components/Cards/CouponCard'
import { CouponCardData } from '@/types/coupon'
import { userService } from '@/config/userServices'

const ProfileMyCoupons = () => {
  const [coupons, setCoupons] = useState<CouponCardData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCollectedCoupons = useCallback(async (isMounted: { current: boolean }) => {
    try {
      if (isMounted.current) setLoading(true)
      const res = await userService.GET_COUPON_COLLECTED() as { coupons: CouponCardData[] }
      console.log('dada', res.coupons)
      if (isMounted.current) setCoupons(res.coupons)
    } catch (err) {
      console.error(err)
      if (isMounted.current) setError('ไม่สามารถโหลดคูปองได้')
    } finally {
      if (isMounted.current) setLoading(false)
    }
  }, [])
  
  useEffect(() => {
    const isMounted = { current: true }
  
    fetchCollectedCoupons(isMounted).catch(console.error)
  
    return () => {
      isMounted.current = false
    }
  }, [fetchCollectedCoupons])

  if (loading) return <p className="text-center py-10">Loading...</p>
  if (error) return <p className="text-center py-10">{error}</p>

  return (
    <div className="bg-blue-b flex flex-col min-h-[100dvh]">
      <NavBarWidget />
      <div className="flex-1">
        <div className="flex flex-col md:flex-row items-start justify-start pt-10 md:pt-20 px-5 md:px-10 lg:px-100 h-full gap-6 md:gap-10">
          
          {/* ProfileBar */}
          <div className="w-full md:w-1/4 lg:min-w-[250px]">
            <ProfileBar />
          </div>

          {/* Content */}
          <div className="flex flex-col items-start justify-start gap-y-5 w-full md:w-3/4 lg:w-4/5 px-0 lg:px-40">
            <div className="text-f-24 md:text-f-28 lg:text-f-36">My coupons</div>

            <div className="grid grid-cols-2 lg:grid-cols-2 gap-y-10 w-full lg:w-2xl">
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

export default ProfileMyCoupons
