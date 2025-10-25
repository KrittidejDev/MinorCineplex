import NavAndFooter from '@/components/MainLayout/NavAndFooter'
import React from 'react'
import PinFill from '@/components/Icons/PinFill'
import DateRangeFill from '@/components/Icons/DateRangeFill'
import TimeFill from '@/components/Icons/TimeFill'
import Shop from '@/components/Icons/Shop'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { HoverCard3D } from '@/components/Displays/HoverCard3D'
const BookingDetail = () => {
  return (
    <NavAndFooter>
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-white text-2xl md:text-3xl font-bold mb-6 md:mb-8">
            Booking Detail
          </h1>

          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Movie Poster - Left Side */}
            <HoverCard3D >
            <div className="w-full md:min-w-[387px] md:max-w-[387px] md:flex-shrink-0">
              <div className="relative w-full md:w-fit mx-auto md:mx-0">
                <div className="w-full aspect-[280/408] md:aspect-[387/565] md:min-w-[387px] md:max-w-[387px] md:min-h-[565px] md:max-h-[565px]  rounded-lg overflow-hidden shadow-2xl shadow-cyan-500/30 relative">
                  <Image
                    src=""
                    alt="The Dark Knight"
                    fill
                    sizes="(max-width: 768px) 100vw, 387px"
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
            </HoverCard3D>
            {/* Movie Details - Right Side */}
            <div className="flex-1  rounded-lg p-5 md:p-8 bg-[#070C1BB2]">
              <div className="space-y-5 md:space-y-6">
                {/* Title and Genre */}
                <div>
                  <h2 className="text-[#FFFFFF] text-2xl md:text-4xl font-bold mb-3">
                    The Dark Knight
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    <span className="flex items-center px-3  min-h-[32px] bg-[#21263F] text-[#8B93B0] rounded text-sm">
                      Action
                    </span>
                    <span className="flex items-center px-3 min-h-[32px] bg-[#21263F] text-[#8B93B0] rounded text-sm">
                      Crime
                    </span>
                    <span className="flex items-center px-3 min-h-[32px] bg-[#21263F] text-[#C8CEDD] rounded text-sm">
                      TH
                    </span>
                  </div>
                </div>

                {/* Booking Info */}
                <div className="space-y-3  text-[#C8CEDD] text-sm md:text-base">
                  <div className="flex items-center gap-3">
                    <PinFill  color="#565F7E" />
                    <span>Minor Cineplex Arkham</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <DateRangeFill  color="#565F7E" />
                    <span>24 Jun 2024</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <TimeFill color="#565F7E" />
                    <span>16:30</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shop  color="#565F7E" />
                    <span>Hall 1</span>
                  </div>
                </div>

                {/* Ticket Info */}

                <div className="flex flex-wrap items-center gap-3 md:gap-4 pt-4">
                  <button className="bg-gray-g63f text-gray-gedd font-fm-16 rounded-sm px-4 py-3">
                    2 Tickets
                  </button>
                  <div className="px-4 py-2 ">
                    <span className="text-slate-300 text-sm md:text-base">
                      Selected Seat
                    </span>
                  </div>
                  <div className="px-4 py-2">
                    <span className="text-white font-semibold text-sm md:text-base">
                      C9, C10
                    </span>
                  </div>
                </div>
                {/* Book Button */}
                <Button className=" btn-base blue-normal mt-4 md:mt-6 mb-4 md:mb-10 ">
                  Book more seats
                </Button>

                {/* Synopsis */}
                <div className="space-y-4 pt-4 md:pt-10 border-t border-[#21263F]/50">
                  <p className="text-[#C8CEDD] leading-relaxed text-sm md:text-base">
                    With the help of allies Lt. Jim Gordon (Gary Oldman) and DA
                    Harvey Dent (Aaron Eckhart), Batman (Christian Bale) has
                    been able to keep a tight lid on crime in Gotham City.
                  </p>
                  <p className="text-[#C8CEDD] leading-relaxed text-sm md:text-base">
                    But when a vile young criminal calling himself the Joker
                    (Heath Ledger) suddenly throws the town into chaos, the
                    caped Crusader begins to tread a fine line between heroism
                    and vigilantism.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </NavAndFooter>
  )
}

export default BookingDetail
