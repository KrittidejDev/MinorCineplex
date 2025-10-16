import { Button } from "@/components/ui/button";
import DoneRight from "@/components/Icons/DoneRound";
import { ErrorAlert, SuccessAlert } from "@/components/ui/alert";
import { DefaultCheckbox, DisabledCheckbox } from "@/components/ui/checkbox";
import { Modal } from "@/components/ui/Modal";
import { BookingCard } from "@/components/Cards/bookkingCard";
import { IconsGrid } from "@/components/Icons/Icons";
import { DesignTokens } from "@/components/DesignSystem/DesignTokens";

import Tag from "@/components/Widgets/Tag";
import Radio from "@/components/Widgets/Radio";
import MenuLink from "@/components/Widgets/MenuLink";
import Pagination from "@/components/Widgets/Pagination";
import Tab from "@/components/Widgets/Tab";

import React, { useState } from "react";
import InputTextFeild from "@/components/Inputs/InputTextFeild";
import InputTextArea from "@/components/Inputs/InputTextArea";

import {
  IconCircle,
  PinFill,
  SearchLight,
  StarFill,
  UserDuotone,
  SeatAvailable,
  SeatBooked,
  SeatFriend,
  SeatReserved,
  SeatSelected,
} from "@/components/Icons/Icons";

import DateSelection from "@/components/ui/dateselection";

import ShowTime from "@/components/Widgets/ShowTime";
import ShowtimeMovie from "@/components/Widgets/ShowtimeMovie";
import ReviewCard from "@/components/Cards/ReviewCard";

import {
  BookingStatusPaid,
  BookingStatusPayAtCinema,
  BookingStatusCompleted,
  BookingStatusCanceled,
} from "@/components/ui/bookingstatus";
import SummaryBoxCard from "@/components/Cards/SummaryBoxCard";

import AdminSidebar from "@/components/ui/adminsidebar";
import FilterSearch from "@/components/Widgets/FilterSearch";

const AllWidget = () => {
  // State for radio buttons
  const [selectedRadio, setSelectedRadio] = useState("option2");

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(10);

  // State for tabs
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center">
        <div className="flex flex-row gap-50 justify-center items-center py-10">
          {/* Column 1: Blue Buttons */}
          <div className="flex flex-col gap-10">
            <Button className="btn-base blue-normal">
              btn-base blue-normal
            </Button>

            <Button className="btn-base blue-secondary-normal">
              btn-base blue-secondary-normal
            </Button>

            <Button className="btn-base blue-dark-normal">
              btn-base blue-dark-normal
            </Button>

            <Button className="btn-base blue-disabled">
              btn-base blue-disabled
            </Button>
          </div>

          {/* Column 2: Outline & Gray Buttons */}
          <div className="flex flex-col gap-10">
            <Button className="btn-base white-outline-normal">
              btn-base white-outline-normal
            </Button>

            <Button className="btn-base gray-normal">
              btn-base gray-normal
            </Button>

            <Button className="btn-base slate-normal">
              btn-base slate-normal
            </Button>

            <Button className="btn-base white-outline-disabled">
              btn-base white-outline-disabled
            </Button>
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
        <IconsGrid size="40" columns={5} />
      </div>

      {/* Icon Circle Components */}
      <div className="w-full max-w-4xl mx-auto p-8">
        <h2 className="text-2xl font-bold text-center mb-8 text-white">
          Icon Circle Components
        </h2>

        <div className="bg-gray-gc1b border border-gray-g63f p-8 rounded-lg">
          <h3 className="text-lg font-semibold text-center mb-6 text-white">
            Icon Circle Examples
          </h3>

          {/* Icon Circle Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
            {/* Default Icon Circle */}
            <div className="flex flex-col items-center gap-3">
              <IconCircle icon={PinFill} />
              <span className="text-sm text-gray-gedd text-center">
                Default
              </span>
            </div>

            {/* Custom Size */}
            <div className="flex flex-col items-center gap-3">
              <IconCircle icon={SearchLight} size={40} iconSize={20} />
              <span className="text-sm text-gray-gedd text-center">
                Small (40px)
              </span>
            </div>

            {/* Custom Background */}
            <div className="flex flex-col items-center gap-3">
              <IconCircle
                icon={StarFill}
                backgroundColor="bg-blue-bbee"
                iconColor="#FFFFFF"
              />
              <span className="text-sm text-gray-gedd text-center">
                Blue Background
              </span>
            </div>

            {/* Custom Colors */}
            <div className="flex flex-col items-center gap-3">
              <IconCircle
                icon={PinFill}
                backgroundColor="bg-green-g372"
                iconColor="#FFFFFF"
                size={60}
                iconSize={35}
              />
              <span className="text-sm text-gray-gedd text-center">
                Green Large
              </span>
            </div>
          </div>
          {/* Usage Examples */}
          <div className="mt-8 p-4 bg-gray-g63f rounded-lg">
            <h4 className="text-md font-medium text-white mb-3">
              Usage Examples:
            </h4>
            <div className="space-y-2 text-sm text-gray-gedd">
              <div>
                <code className="bg-gray-gc1b px-2 py-1 rounded">
                  {"<IconCircle icon={PinFill} />"}
                </code>
              </div>
              <div>
                <code className="bg-gray-gc1b px-2 py-1 rounded">
                  {"<IconCircle icon={SearchLight} size={40} iconSize={20} />"}
                </code>
              </div>
              <div>
                <code className="bg-gray-gc1b px-2 py-1 rounded">
                  {
                    '<IconCircle icon={StarFill} backgroundColor="bg-blue-bbee" iconColor="#FFFFFF" />'
                  }
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seat Icons Components */}
      <div className="w-full max-w-4xl mx-auto p-8">
        <h2 className="text-2xl font-bold text-center mb-8 text-white">
          Seat Icons Components
        </h2>

        <div className="bg-gray-gc1b border border-gray-g63f p-8 rounded-lg">
          <h3 className="text-lg font-semibold text-center mb-6 text-white">
            Seat Icon Examples
          </h3>

          {/* Seat Icons Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
            {/* Seat Available */}
            <div className="flex flex-col items-center gap-3">
              <SeatAvailable />
              <span className="text-sm text-gray-gedd text-center">
                Available
              </span>
            </div>

            {/* Seat Booked */}
            <div className="flex flex-col items-center gap-3">
              <SeatBooked />
              <span className="text-sm text-gray-gedd text-center">Booked</span>
            </div>

            {/* Seat Friend */}
            <div className="flex flex-col items-center gap-3">
              <SeatFriend />
              <span className="text-sm text-gray-gedd text-center">Friend</span>
            </div>

            {/* Seat Reserved */}
            <div className="flex flex-col items-center gap-3">
              <SeatReserved />
              <span className="text-sm text-gray-gedd text-center">
                Reserved
              </span>
            </div>

            {/* Seat Selected */}
            <div className="flex flex-col items-center gap-3">
              <SeatSelected />
              <span className="text-sm text-gray-gedd text-center">
                Selected
              </span>
            </div>
          </div>

          {/* Usage Examples */}
          <div className="mt-8 p-4 bg-gray-g63f rounded-lg">
            <h4 className="text-md font-medium text-white mb-3">
              Usage Examples:
            </h4>
            <div className="space-y-2 text-sm text-gray-gedd">
              <div>
                <code className="bg-gray-gc1b px-2 py-1 rounded">
                  {"<SeatAvailable />"}
                </code>
              </div>
              <div>
                <code className="bg-gray-gc1b px-2 py-1 rounded">
                  {"<SeatBooked width={32} height={32} />"}
                </code>
              </div>
              <div>
                <code className="bg-gray-gc1b px-2 py-1 rounded">
                  {'<SeatSelected color="#FF0000" />'}
                </code>
              </div>
            </div>
          </div>
        </div>
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
            <h3 className="text-lg font-semibold text-center">
              Auto-sizing Tags
            </h3>
            <div className="flex flex-wrap gap-3 justify-center">
              <Tag name="A" variant="genre" />
              <Tag name="Short" variant="language" />
              <Tag name="Medium Length" variant="genre" />
              <Tag name="Very Long Tag Name" variant="language" />
              <Tag
                name="Extremely Long Tag Name That Should Auto Resize"
                variant="genre"
              />
            </div>
          </div>

          {/* Font Size Examples */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-center">
              Font Size Examples
            </h3>
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

        {/* Radio Button Components */}
        <div className="w-full max-w-sm mx-auto p-8">
          <h2 className="text-2xl font-bold text-center mb-8 text-white">
            Radio Button Components
          </h2>

          {/* Radio Button States Demo */}
          <div className="bg-gray-gc1b border border-gray-g63f p-8 rounded-lg">
            <h3 className="text-lg font-semibold text-center mb-6 text-white">
              Radio Button States
            </h3>

            {/* Radio States - Column Layout */}
            <div className="flex justify-center" data-test="radio-container">
              <div className="flex flex-col items-start space-y-4">
                <Radio
                  name="demo"
                  value="default"
                  label="Default"
                  checked={selectedRadio === "default"}
                  onChange={setSelectedRadio}
                />
                <Radio
                  name="demo"
                  value="selected"
                  label="Selected"
                  checked={selectedRadio === "selected"}
                  onChange={setSelectedRadio}
                />
                <Radio
                  name="disabled"
                  value="disabled1"
                  label="Disabled Option"
                  disabled
                />
              </div>
            </div>
          </div>
        </div>

        {/* Menu Link Components */}
        <div className="w-full max-w-md mx-auto p-8">
          <h2 className="text-2xl font-bold text-center mb-8 text-white">
            Menu Link Components
          </h2>

          {/* Menu Link States Demo */}
          <div className="bg-gray-gc1b border border-gray-g63f p-8 rounded-lg">
            <h3 className="text-lg font-semibold text-center mb-6 text-white">
              Menu Link States
            </h3>

            {/* Menu Link States - Column Layout */}
            <div
              className="flex justify-center"
              data-test="menu-link-container"
            >
              <div className="flex flex-col items-start space-y-4 w-full">
                <MenuLink
                  icon={UserDuotone}
                  text="Booking history"
                  isActive={false}
                />
                <MenuLink
                  icon={UserDuotone}
                  text="Booking history"
                  isActive={true}
                />
              </div>
            </div>

            {/* Usage Examples */}
            <div className="mt-8 p-4 bg-gray-g63f rounded-lg">
              <h4 className="text-md font-medium text-white mb-3">
                Usage Examples:
              </h4>
              <div className="space-y-2 text-sm text-gray-gedd">
                <div>
                  <code className="bg-gray-gc1b px-2 py-1 rounded">
                    {'<MenuLink icon={UserDuotone} text="Booking history" />'}
                  </code>
                </div>
                <div>
                  <code className="bg-gray-gc1b px-2 py-1 rounded">
                    {
                      '<MenuLink icon={UserDuotone} text="Booking history" isActive={true} />'
                    }
                  </code>
                </div>
                <div>
                  <code className="bg-gray-gc1b px-2 py-1 rounded">
                    {
                      "<MenuLink icon={UserDuotone} text=\"Booking history\" onClick={() => console.log('clicked')} />"
                    }
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination Components */}
        <div className="w-full max-w-4xl mx-auto p-8">
          <h2 className="text-2xl font-bold text-center mb-8 text-white">
            Pagination Components
          </h2>

          {/* Pagination Variants Demo */}
          <div className="bg-gray-gc1b border border-gray-g63f p-8 rounded-lg">
            <h3 className="text-lg font-semibold text-center mb-6 text-white">
              Pagination Variants
            </h3>

            {/* Pagination Variants - Row Layout */}
            <div className="flex flex-col items-center space-y-8">
              {/* Page Variant */}
              <div className="flex flex-col items-center gap-3">
                <h4 className="text-md font-medium text-white">Page Variant</h4>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  variant="page"
                />
              </div>

              {/* Carat Variant */}
              <div className="flex flex-col items-center gap-3">
                <h4 className="text-md font-medium text-white">
                  Carat Variant
                </h4>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  variant="carat"
                />
              </div>

              {/* Pagination Variant */}
              <div className="flex flex-col items-center gap-3">
                <h4 className="text-md font-medium text-white">
                  Pagination Variant
                </h4>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  variant="pagination"
                />
              </div>
            </div>

            {/* Usage Examples */}
            <div className="mt-8 p-4 bg-gray-g63f rounded-lg">
              <h4 className="text-md font-medium text-white mb-3">
                Usage Examples:
              </h4>
              <div className="space-y-2 text-sm text-gray-gedd">
                <div>
                  <code className="bg-gray-gc1b px-2 py-1 rounded">
                    {
                      '<Pagination currentPage={1} totalPages={10} onPageChange={setPage} variant="page" />'
                    }
                  </code>
                </div>
                <div>
                  <code className="bg-gray-gc1b px-2 py-1 rounded">
                    {
                      '<Pagination currentPage={1} totalPages={10} onPageChange={setPage} variant="carat" />'
                    }
                  </code>
                </div>
                <div>
                  <code className="bg-gray-gc1b px-2 py-1 rounded">
                    {
                      '<Pagination currentPage={1} totalPages={10} onPageChange={setPage} variant="pagination" />'
                    }
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Components */}
        <div className="w-full max-w-4xl mx-auto p-8">
          <h2 className="text-2xl font-bold text-center mb-8 text-white">
            Tab Components
          </h2>

          {/* Tab Variants Demo */}
          <div className="bg-gray-gc1b border border-gray-g63f p-8 rounded-lg">
            <h3 className="text-lg font-semibold text-center mb-6 text-white">
              Tab States
            </h3>

            {/* Tab States - Row Layout */}
            <div className="flex flex-col items-center space-y-8">
              {/* Tab Example */}
              <div className="flex flex-col items-center gap-3">
                <h4 className="text-md font-medium text-white">
                  Tab Navigation
                </h4>
                <div className="flex gap-8">
                  <Tab
                    text="Movies"
                    isActive={activeTab === 0}
                    onClick={() => setActiveTab(0)}
                  />
                  <Tab
                    text="Cinemas"
                    isActive={activeTab === 1}
                    onClick={() => setActiveTab(1)}
                  />
                  <Tab
                    text="Promotions"
                    isActive={activeTab === 2}
                    onClick={() => setActiveTab(2)}
                  />
                </div>
              </div>
            </div>

            {/* Usage Examples */}
            <div className="mt-8 p-4 bg-gray-g63f rounded-lg">
              <h4 className="text-md font-medium text-white mb-3">
                Usage Examples:
              </h4>
              <div className="space-y-2 text-sm text-gray-gedd">
                <div>
                  <code className="bg-gray-gc1b px-2 py-1 rounded">
                    {
                      '<Tab text="Movies" isActive={true} onClick={() => setActiveTab(0)} />'
                    }
                  </code>
                </div>
                <div>
                  <code className="bg-gray-gc1b px-2 py-1 rounded">
                    {
                      "<Tab text=\"Cinemas\" onClick={() => console.log('clicked')} />"
                    }
                  </code>
                </div>
                <div>
                  <code className="bg-gray-gc1b px-2 py-1 rounded">
                    {'<Tab text="Custom Text" className="custom-class" />'}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="flex justify- ">
        <form className="w-[900px] px-5 flex py-10 mt-10">
          <InputTextFeild
            label="Label"
            placeholder="Placeholder Text"
            text="Help text goes here"
          />
          <InputTextArea placeholder="Placeholder Text" label="Label" />
        </form>
      </div>

      {/* Filter Search */}
      <div className="mt-20 w-full max-w-6xl px-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Filter Search</h2>
        <div className="flex justify-center">
          <FilterSearch
            onSearch={(filters) => {
              console.log("Search filters:", filters);
            }}
          />
        </div>
      </div>

      {/* Showtime Selection Preview */}
      {/* <div className="mt-20 w-full max-w-4xl px-4">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Showtime Selection
        </h2>
        <div className="flex justify-center">
          <ShowTime
            cinemaName="Example Cinema"
            badges={["Hearing assistance", "Wheelchair access"]}
            groups={[
              {
                hallId: "hall1",
                hallLabel: "Hall 1",
                times: [
                  { id: "time1", label: "10:00" },
                  { id: "time2", label: "12:00" },
                  { id: "time3", label: "14:30", disabled: true },
                ],
              },
              {
                hallId: "hall2",
                hallLabel: "Hall 2",
                times: [
                  { id: "time4", label: "11:00" },
                  { id: "time5", label: "13:30" },
                ],
              },
            ]}
            collapsed={false}
            onChange={(time, context) => {
              console.log("Selected time:", time, "in hall:", context.hallId);
            }}
          />
        </div>
      </div> */}
      {/* ShowtimeMovie Preview */}
      <div className="mt-20 w-full max-w-6xl px-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Showtime Movie</h2>
        <div className="w-full">
          <ShowtimeMovie
            data={{
              id: "movie1",
              title: "Example Movie",
              genre: "Action, Adventure",
              poster_url: "/images/poster.png",
            }}
          />
        </div>
      </div>

      {/* Showtime Preview */}
      <div className="mt-20 w-full max-w-4xl px-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Showtime</h2>
        <div className="w-full">
          <ShowTime />
        </div>
      </div>

      {/* Date Selection Preview */}
      <div className="mt-20 w-full max-w-4xl px-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Date Selection</h2>
        <div className="flex justify-center">
          <DateSelection day={"Today"} date={"25 Sep 1996"} />
          <DateSelection day={"Tomorrow"} date={"26 Sep 1996"} />
        </div>
      </div>

      {/* Booking Status */}
      <div className="mt-20">
        <h2 className="text-2xl font-bold mb-6 text-center">Booking Status</h2>
        <div className="flex gap-5">
          <BookingStatusPaid />
          <BookingStatusPayAtCinema />
          <BookingStatusCompleted />
          <BookingStatusCanceled />
        </div>
      </div>

      {/* Summary Box */}
      <div className="mt-20">
        <h2 className="text-2xl font-bold mb-6 text-center">Summary Box</h2>
        <div className="flex gap-5">
          <SummaryBoxCard canPay={true} />
        </div>
      </div>

      {/* Review */}
      <div className="mt-20">
        <h2 className="text-2xl font-bold mb-6 text-center">Review</h2>
        <div className="flex gap-5">
          <ReviewCard />
        </div>
      </div>

      {/* Admin Sidebar */}
      <div className="mt-20">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Sidebar</h2>
        <div className="flex gap-5">
          <AdminSidebar />
        </div>
      </div>
    </div>
  );
};

export default AllWidget;
