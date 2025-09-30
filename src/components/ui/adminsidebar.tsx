import { useState } from 'react'

import LogoM from '../Icons/LogoM'
import Link from 'next/link'


function AdminSidebar() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const tabs = [
    {
      title: 'dashboard',
      url: '/admin/dashboard',
    },
    { title: 'cinemas', 
      url: '/admin/cinema' 
    },
    { title: 'hall', 
      url: '/admin/hall' 
    },
    { title: 'movies', 
      url: '/admin/movie' 
    },
    { title: 'time slot', 
      url: '/admin/timeslot' 
    },
    { title: 'showtimes', 
      url: '/admin/showtime' 
    },
    { title: 'trailers',
       url: '/admin/trailer' 
    },
    { title: 'banner', 
      url: '/admin/banner' 
    },
    { title: 'coupon', 
      url: '/admin/coupon' 
    }
  ]

  return (
    <>
      <div className="h-full bg-gray-gc1b flex flex-col py-[50px] px-[72px]">
        <div className="flex">
          <div className="mt-1 pr-2.5 border-r">
            <LogoM />
          </div>
          <h2 className="font-bold text-[44px] text-white-wfff pl-2.5">
            Admin
          </h2>
        </div>

        <div className="flex flex-col gap-2 mt-[30px]">
         

{tabs.map((tab) => (
  <Link key={tab.title} href={tab.url}>
    <button
      onClick={() => setActiveTab(tab.title)}
      className={`py-3 px-4 cursor-pointer ${
        activeTab === tab.title ? "bg-gray-g63f rounded-sm" : ""
      }`}
    >
      <span
        className={`font-bold ${
          activeTab === tab.title ? "text-white-wfff" : "text-gray-gedd"
        }`}
      >
        {tab.title.charAt(0).toUpperCase() + tab.title.slice(1)}
      </span>
    </button>
  </Link>
))}

        </div>

        <button className="py-3 px-4 mt-2 cursor-pointer">
          <p className="font-bold text-gray-gedd">Logout</p>
        </button>
      </div>
    </>
  )
}

export default AdminSidebar
