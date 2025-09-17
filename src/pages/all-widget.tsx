import { Button } from "@/components/ui/button";
import DoneRight from "@/components/Icons/DoneRound";
import { ErrorAlert, SuccessAlert } from "@/components/ui/alert";
import {DefaultCheckbox, DisabledCheckbox } from "@/components/ui/checkbox"
import React from "react";

const AllWidget = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center">
        <div className="flex flex-row gap-10 justify-center items-center py-10">
          {/* Column 1: Blue Buttons */}
          <div className="flex flex-col gap-10">
            <Button className="btn-base blue-normal">Button</Button>

            <Button className="btn-base blue-secondary-normal">Button</Button>

            <Button className="btn-base blue-dark-normal">Button</Button>

            <Button className="btn-base blue-disabled">Button</Button>
          </div>

          {/* Column 2: Outline & Gray Buttons */}
          <div className="flex flex-col gap-10">
            <Button className="btn-base white-outline-normal">Button</Button>

            <Button className="btn-base gray-normal">Button</Button>

            <Button className="btn-base slate-normal">Button</Button>

            <Button className="btn-base white-outline-disabled">Button</Button>
          </div>

          {/* Column 3: Transparent Link Buttons */}
          <div className="flex flex-col gap-10">
            <Button className="btn-base transparent-underline-normal">
              Button
            </Button>

            <Button className="btn-base transparent-underline-semi">
              Button
            </Button>

            <Button className="btn-base transparent-underline-more">
              Button
            </Button>

            <Button className="btn-base transparent-underline-most">
              Button
            </Button>
          </div>
        </div>
      </div>
      {/* Modal */}
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
      <div className="mt-10 flex flex-col items-center gap-5">
        <h1 className="text-xl font-bold">Step</h1>
        <div className="flex gap-10">
          <div className="stp-default">1</div>
          <div className="stp-current">2</div>
          <div className="stp-done">
            <DoneRight />
          </div>
        </div>
      </div>

      {/* Alert */}
      <div className="mt-20">
        <h1 className="text-xl font-bold">Alert</h1>
      </div>
      <div className="flex flex-col gap-5 mt-5">
        <ErrorAlert />
        <SuccessAlert />
      </div>

      {/* checkbox */}
      <div className="flex flex-col gap-2 mt-20">
      <DefaultCheckbox label="Option 1" />
      <DefaultCheckbox label="Option 1" defaultChecked />
      <DefaultCheckbox label="Option 1" />
      <DisabledCheckbox/>
    </div>

    </div>
  )
}

export default AllWidget
