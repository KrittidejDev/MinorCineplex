import React from 'react'
import NavBarWidget from '@/components/Widgets/NavBarWidget'
import ProfileBar from '@/components/Widgets/ProfileBar'
import { BookingCard } from '@/components/Cards/bookkingCard'

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

          {/* Content - Full Width Container */}
          <div className="flex flex-col items-start justify-start gap-y-5 w-full md:w-3/4 lg:w-4/5 px-0 md:px-0 lg:px-22">
            
            <div className="flex flex-col  gap-y-5 w-full px-0 md:px-0 lg:px-0">
              
              <div className="w-full">
              <div className="text-f-24 md:text-f-28 lg:text-f-36 px-0 md:px-0 lg:px-42 ">Booking history</div>
                <BookingCard
                  movieTitle="The Dark Knight"
                  moviePoster="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQkUywIUXDjHSQJIaNHYVs08osgBpF5Ot-xmB_omyEZeeRP9Xug"
                  location="Minor Cineplex Arkham"
                  date="24 Jun 2024"
                  time="16:30"
                  hall="Hall 1"
                  bookingNumber="AK11223"
                  bookedDate="24 Jun 2024"
                  selectedSeats="C9, C10"
                  ticketCount={2}
                  paymentMethod="Credit card"
                  isPaid={true}
                />
              </div>
              <div className="w-full">
                <BookingCard
                  movieTitle="The Dark Knight"
                  moviePoster="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQkUywIUXDjHSQJIaNHYVs08osgBpF5Ot-xmB_omyEZeeRP9Xug"
                  location="Minor Cineplex Arkham"
                  date="24 Jun 2024"
                  time="16:30"
                  hall="Hall 1"
                  bookingNumber="AK11223"
                  bookedDate="24 Jun 2024"
                  selectedSeats="C9, C10"
                  ticketCount={2}
                  paymentMethod="Credit card"
                  isPaid={true}
                />
              </div>
              <div className="w-full">
                <BookingCard
                  movieTitle="The Dark Knight"
                  moviePoster="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQkUywIUXDjHSQJIaNHYVs08osgBpF5Ot-xmB_omyEZeeRP9Xug"
                  location="Minor Cineplex Arkham"
                  date="24 Jun 2024"
                  time="16:30"
                  hall="Hall 1"
                  bookingNumber="AK11223"
                  bookedDate="24 Jun 2024"
                  selectedSeats="C9, C10"
                  ticketCount={2}
                  paymentMethod="Credit card"
                  isPaid={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index