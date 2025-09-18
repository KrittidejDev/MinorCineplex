import React from 'react'
import NavAndFooter from '@/components/MainLayout/NavAndFooter'

const CouponDetail = () => {
  return (
  <NavAndFooter>
    <div className='flex flex-row w-full h-screen px-40 py-30 gap-5'>
      <div className='w-1/3 h-full #8B93B0'><img src="/public/file.svg" alt="mock" /></div>
      <div className='w-2/3 h-full bg-amber-100 border rounded-[6px]'></div>
      </div>
    </NavAndFooter>
    )
}

export default CouponDetail
