import { Button } from "@/components/ui/button";
import DoneRight from "@/components/Icons/DoneRound";
import { ErrorAlert, SuccessAlert } from "@/components/ui/alert";
import { DefaultCheckbox, DisabledCheckbox } from "@/components/ui/checkbox"
import { Modal } from "@/components/ui/Modal";
import { BookingCard } from "@/components/Cards/bookkingCard";
import { IconsGrid } from "@/components/Icons/Icons";
import { DesignTokens } from "@/components/DesignSystem/DesignTokens";

import Tag from "@/components/Tag";

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

      {/* Icons Grid */}
      <div className="mt-20 w-full max-w-7xl px-4">
        <IconsGrid size="40" color="#3B82F6" columns={5} />
      </div>

      {/* Design Tokens */}
      <div className="mt-20 w-full max-w-7xl px-4">
        <DesignTokens columns={5} />
      </div>

      {/* Tag Components */}
      <div className="mt-20 w-full max-w-4xl px-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Tag Components</h2>
        <div className="flex flex-col items-center gap-8">
          {/* Genre Tags */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-center">Genre Tags</h3>
            <div className="flex flex-wrap gap-3 justify-center">
              <Tag name="Action" variant="genre" />
              <Tag name="Comedy" variant="genre" />
              <Tag name="Drama" variant="genre" />
              <Tag name="Horror" variant="genre" />
              <Tag name="Romance" variant="genre" />
              <Tag name="Sci-Fi" variant="genre" />
            </div>
          </div>

          {/* Language Tags */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-center">Language Tags</h3>
            <div className="flex flex-wrap gap-3 justify-center">
              <Tag name="TH" variant="language" />
              <Tag name="EN" variant="language" />
              <Tag name="KR" variant="language" />
              <Tag name="JP" variant="language" />
              <Tag name="CH" variant="language" />
            </div>
          </div>

          {/* Auto-sizing Tags */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-center">Auto-sizing Tags</h3>
            <div className="flex flex-wrap gap-3 justify-center">
              <Tag name="A" variant="genre" />
              <Tag name="Short" variant="language" />
              <Tag name="Medium Length" variant="genre" />
              <Tag name="Very Long Tag Name" variant="language" />
              <Tag name="Extremely Long Tag Name That Should Auto Resize" variant="genre" />
            </div>
          </div>

          {/* Font Size Examples */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-center">Font Size Examples</h3>
            <div className="flex flex-wrap gap-3 justify-center items-center">
              <Tag name="fr-12" variant="genre" fontSize="fr-12" />
              <Tag name="fm-12" variant="language" fontSize="fm-12" />
              <Tag name="fr-14" variant="genre" fontSize="fr-14" />
              <Tag name="fm-14" variant="language" fontSize="fm-14" />
              <Tag name="fr-16" variant="genre" fontSize="fr-16" />
              <Tag name="fm-16" variant="language" fontSize="fm-16" />
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default AllWidget
