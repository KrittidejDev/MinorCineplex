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
    <div className="flex flex-col bg-[#070C1B] p-2 md:p-4 rounded-[8px] w-full md:w-auto ">
      <nav className="flex flex-row md:flex-col w-full md:w-auto gap-1 md:gap-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center md:justify-start justify-center 
                px-3 md:px-6 py-2 md:py-3 rounded-[6px] transition-colors cursor-pointer gap-2 
                ${
                  isActive
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-300 hover:bg-[#21263F] hover:text-white'
                }`}
            >
              {item.icon}
              {/* label ซ่อนบนจอเล็ก */}
              <span className="hidden md:inline">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export default ProfileBar
