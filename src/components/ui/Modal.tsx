import React from 'react'
import { Button } from './button'

export const Modal = () => {
  return (
    <div className='flex flex-col items-center '>
        <div className="bg-[#21263F] rounded-lg shadow-xl max-w-md w-[343px] h-[194px]  relative ">
          {/* Close Button */}
          <button className="absolute top-5 right-10 text-white hover:text-gray-300 transition-colors cursor-pointer">
            X
          </button>
          {/* Modal Content */}
          <div className="p-5 items-center text-center">
            <h2 className="flex flex-col items-center text-white text-xl font-semibold mb-4">
              Modal Title
            </h2>

            <p className="text-gray-300 text-sm leading-relaxed mb-5 w-full">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>

            <div className="flex flex-row items-center justify-center gap-7">
              {/* White Outline Button */}
              <Button className="btn-base white-outline-normal">Button</Button>

              {/* Blue Button */}
              <Button className="btn-base blue-normal">Button</Button>
            </div>
          </div>
        </div>
      </div>
  )
}
