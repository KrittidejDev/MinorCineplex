import { Button } from "@/components/ui/button";
import DoneRight from "@/components/Icons/DoneRound";
import { ErrorAlert, SuccessAlert } from "@/components/ui/alert";
import { DefaultCheckbox, DisabledCheckbox } from "@/components/ui/checkbox"
import { Modal } from "@/components/ui/Modal";
import BookingCard from "@/components/ui/bookking-card";
import React from "react";

const AllWidget = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center">
        <div className="flex flex-row gap-50 justify-center items-center py-10">
          {/* Column 1: Blue Buttons */}
          <div className="flex flex-col gap-10">
            <Button className="btn-base blue-normal">btn-base blue-normal</Button>

            <Button className="btn-base blue-secondary-normal">btn-base blue-secondary-normal</Button>

            <Button className="btn-base blue-dark-normal">btn-base blue-dark-normal</Button>

            <Button className="btn-base blue-disabled">btn-base blue-disabled</Button>
          </div>

          {/* Column 2: Outline & Gray Buttons */}
          <div className="flex flex-col gap-10">
            <Button className="btn-base white-outline-normal">btn-base white-outline-normal</Button>

            <Button className="btn-base gray-normal">btn-base gray-normal</Button>

            <Button className="btn-base slate-normal">btn-base slate-normal</Button>

            <Button className="btn-base white-outline-disabled">btn-base white-outline-disabled</Button>
          </div>

          {/* Column 3: Transparent Link Buttons */}
          <div className="flex flex-col gap-10">
            <Button className="btn-base transparent-underline-normal">
              btn-base transparent-underline-normal
            </Button>

            <Button className="btn-base transparent-underline-semi">
              btn-base transparent-underline-semi
            </Button>

            <Button className="btn-base transparent-underline-more">
              btn-base transparent-underline-more
            </Button>

            <Button className="btn-base transparent-underline-most">
              btn-base transparent-underline-most
            </Button>
          </div>
        </div>
      </div>
      {/* Modal */}
      <Modal />
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
        <DisabledCheckbox />
      </div>

      {/* Booking Card */}
      <div className="mt-20 w-full">
        <BookingCard
          movieTitle="The Dark Knight"
          moviePoster="https://images.unsplash.com/photo-1531259683007-016a9b2c5f38?w=200&h=300&fit=crop&crop=center"
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
  )
}

export default AllWidget
