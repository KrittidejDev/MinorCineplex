import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import UserDuotone from '../Icons/UserDuotone'
import NotebookLight from '../Icons/NotebookLight'
import CouponLight from '../Icons/CouponLight'
import RefreshLight from '../Icons/RefreshLight'

const ProfileBar = () => {
  const router = useRouter()
  const pathname = router.pathname

  const navigationItems = [
    {
      icon: <NotebookLight />,
      label: 'Booking history',
      href: '/profiles/bookingHistory',
    },
    { icon: <CouponLight />, label: 'My coupons', href: '/profiles/myCoupon' },
    { icon: <UserDuotone />, label: 'Profile', href: '/profiles/profile' },
    {
      icon: <RefreshLight />,
      label: 'Reset password',
      href: '/profiles/resetPassword',
    },
  ]

  return (
    <div className="flex   bg-[#070C1B] p-4 rounded-[8px]">
      <nav className="flex flex-col space-y-2 ">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-row justify-start items-start w-full px-16 py-4 rounded-[6px] transition-colors cursor-pointer gap-2 ${
                isActive
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-300 hover:bg-[#21263F] hover:text-white'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export default ProfileBar
