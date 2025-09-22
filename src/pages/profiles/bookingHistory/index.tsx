import React from 'react'
import NavBarWidget from '@/components/Widgets/NavBarWidget'
import ProfileBar from '@/components/Widgets/ProfileBar'
import { BookingCard } from '@/components/Cards/bookkingCard'
const index = () => {
  return (
    <div className="bg-blue-b flex flex-col min-h-[100dvh]">
      <NavBarWidget />
      <div className="flex flex-row items-start justify-center pt-20 px-50 h-full gap-x-10">
        <div>
          <ProfileBar />
        </div>
        <div className="flex flex-col items-start justify-start gap-y-5">
          <div className='text-f-36'>Booking history</div>
          <div className="flex flex-col gap-y-5">
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
  )
}

export default index
