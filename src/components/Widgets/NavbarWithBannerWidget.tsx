import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import Image from "next/image";
import NavBarWidget from "./NavBarWidget";
import Autoplay from "embla-carousel-autoplay";

const NavbarWithBannerWidget = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  return (
    <div className="w-full relative">
      <div className="w-full absolute top-0 left-0 right-0 z-30">
        <NavBarWidget />
      </div>
      <Carousel plugins={[plugin.current]} className="w-full ">
        <CarouselContent>
          <CarouselItem>
            <Image
              src="/images/banner.png"
              alt="banner"
              width={1440}
              height={400}
            />
          </CarouselItem>
          <CarouselItem>
            <Image
              src="/images/banner.png"
              alt="banner"
              width={1440}
              height={400}
            />
          </CarouselItem>
          <CarouselItem>
            <Image
              src="/images/banner.png"
              alt="banner"
              width={1440}
              height={400}
            />
          </CarouselItem>
        </CarouselContent>
        <div className="absolute top-1/2 -translate-y-1/2 left-20">
          <CarouselPrevious />
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 right-20">
          <CarouselNext />
        </div>
      </Carousel>
    </div>
  );
};

export default NavbarWithBannerWidget;
