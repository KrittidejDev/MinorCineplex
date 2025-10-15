
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
    <div className="bg-blue-b flex flex-col">
      <NavBarWidget />
      <div className="flex-1">
        <div className="w-full flex flex-col md:flex-row items-start gap-6 md:gap-12 top-21 transition-all duration-500 ease-in-out 
    py-10 md:pl-20 md:py-15 xl:pl-56">
          
          {/* ProfileBar */}
          <div className="w-full md:min-w-[240px] md:max-w-[257px]">
            <ProfileBar />
          </div>

          {/* Content */}
          <div className="flex flex-col px-4 gap-6 md:gap-12 justify-start items-start w-full">
            <div className="text-f-24 md:text-f-28 lg:text-f-36">My coupons</div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 w-full gap-y-10 max-w-[795px]">
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
