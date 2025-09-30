import React from 'react'
import NavBarWidget from '@/components/Widgets/NavBarWidget'
import ProfileBar from '@/components/Widgets/ProfileBar'
import InputTextFeild from '@/components/Inputs/InputTextFeild'
import ImageUploadButton from '@/components/Inputs/InputPictureProfile'
import { Button } from '@/components/ui/button'

const Index = () => {
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
          <div className="w-full md:w-1/4 ">
            <ProfileBar />
          </div>

          {/* Content */}
          <div className="flex flex-col items-start justify-start gap-y-11 w-full md:w-3/4 lg:w-4/5 px-0 md:px-0 lg:px-22">
            <div className="text-f-20 sm:text-f-24 md:text-f-28 lg:text-f-36">
              Profile
            </div>

            <div className="text-[#8B93B0] text-sm sm:text-base">
              Keep your personal details private. Information you add here is
              visible to anyone who can view your profile
            </div>

            <div>
              <ImageUploadButton />
            </div>

            <div className="flex flex-col gap-y-5 w-full ">
              <InputTextFeild label="Name" placeholder="Placeholder Text" className='w-[45%]' />
              <InputTextFeild label="Email" placeholder="Placeholder Text" className='w-[45%]' />
              <Button className="btn-base white-outline-normal w-[12.5%]">
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index
