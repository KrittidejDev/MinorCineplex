import React from 'react'
import NavBarWidget from '@/components/Widgets/NavBarWidget'
import ProfileBar from '@/components/Widgets/ProfileBar'
const index = () => {
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
          <div className="w-full md:w-1/4 lg:w-1/5">
            <ProfileBar />
          </div>

          {/* Content - Full Width Container */}
          <div className="flex flex-col items-start justify-start gap-y-5 w-full md:w-3/4 lg:w-4/5 px-0 md:px-0 lg:px-22">
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default index
