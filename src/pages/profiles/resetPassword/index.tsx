import React from 'react'
import NavBarWidget from '@/components/Widgets/NavBarWidget'
import ProfileBar from '@/components/Widgets/ProfileBar'
import InputTextFeild from '@/components/Inputs/InputTextFeild'
import { Button } from '@/components/ui/button'
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
          <div className="flex flex-col items-start justify-start gap-y-11 w-full md:w-3/4 lg:w-4/5 px-0 md:px-0 lg:px-22">
            <div className="text-f-20 sm:text-f-24 md:text-f-28 lg:text-f-36">
              Reset password
            </div>
            <div className="flex flex-col gap-y-5 w-full ">
              <InputTextFeild
                label="New password"
                placeholder="New password"
                className="lg:w-[45%] w-[70%]"
              />
              <InputTextFeild
                label="Confrim password"
                placeholder="Confrim password"
                className="lg:w-[45%] w-[70%]"
              />
              <Button className="flex btn-base white-outline-normal w-[22.5%] min-w-[100px]">
                Reset password
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default index
