import React from "react";
import NavBarWidget from "@/components/Widgets/NavBarWidget";
import ProfileBar from "@/components/Widgets/ProfileBar";
import { BookingCard } from "@/components/Cards/bookkingCard";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "react-i18next";

const Index = () => {
  const { t } = useTranslation("common");
  const dataCount: number[] = [1, 2, 3, 4, 5];

  return (
    <div className="bg-blue-b flex flex-col">
      <NavBarWidget />
      <div
        className="w-full min-w-screen flex flex-col md:flex-row max-w-[1129px] items-start gap-6 lg:gap-12 top-21 
      py-10 md:pl-20 md:py-15 xl:pl-56"
      >
        {/* ProfileBar */}
        <div className="w-full md:max-w-[257px]">
          <ProfileBar />
        </div>

        {/* Content - Full Width Container */}
        <div className="flex flex-col px-4 gap-6 md:gap-6 justify-start items-start w-full md:max-w-[691px]">
          <div className="flex flex-col gap-5 w-full">
            <div className="text-f-36 text-white">{t("booking_history")}</div>
            {dataCount.map((item) => (
              <div key={item} className="w-full">
                <BookingCard
                  movieTitle={`The Dark Knight ${item}`}
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default Index;
