import React from 'react'
import { Button } from './button'
import CloseRoundLight from '../Icons/CloseRoundLight'

export const Modal = () => {
  return (
    <div className='flex flex-col items-center '>
        <div className="bg-[#21263F] rounded-lg shadow-xl p-5 relative border-1 border-[#565F7E] ">
          {/* Close Button */}
          <button className="absolute top-5 right-10 text-[#FFFFFF] hover:text-[#C8CEDD] transition-colors cursor-pointer">
            <CloseRoundLight />
          </button>
          {/* Modal Content */}
          <div className="p-5 items-center text-center">
            <h2 className="flex flex-col items-center text-[#FFFFFF] text-xl font-semibold mb-4">
              Modal Title
            </h2>

            <p className="text-[#C8CEDD] text-sm leading-relaxed mb-5 w-full">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>

            <div className="flex flex-row items-center justify-center gap-7">
              {/* White Outline Button */}
              <Button className="btn-base white-outline-normal">btn-base white-outline-normal</Button>

              {/* Blue Button */}
              <Button className="btn-base blue-normal cursor-pointer">btn-base blue-normal</Button>
            </div>
          </div>
        </div>
      </div>
  )
}
