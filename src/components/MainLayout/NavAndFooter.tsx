import React, { ReactNode } from "react";
import FooterWidget from "../Widgets/FooterWidget";
import NavBarWidget from "../Widgets/NavBarWidget";
import SEO, { SEOProps } from "./SEO";

interface NavAndFooterProps {
  children: ReactNode;
  seoProps?: SEOProps;
}

const NavAndFooter = ({ children, seoProps }: NavAndFooterProps) => {
  const defaultSEO: SEOProps = {
    title: "MinorCineplex - โรงภาพยนตร์ชั้นนำของประเทศไทย",
    description:
      "จองตั๋วภาพยนตร์ ดูรอบฉาย และรับโปรโมชันสุดพิเศษจาก Minorcineplex โรงภาพยนตร์ที่ดีที่สุดในประเทศไทย",
    image: "https://cdn.majorcineplex.com/uploads/movie/4852/thumb_4852.jpg",
    imageWidth: 800,
    imageHeight: 1200,
    imageAlt: "โปสเตอร์หน้าแรก Minorcineplex",
    url: "https://minor-cineplex-phi.vercel.app",
  };

  return (
    <div className="bg-blue-b flex flex-col min-h-[100dvh]">
      <SEO {...(seoProps || defaultSEO)} />
      <NavBarWidget />
      <div className="flex flex-col items-center flex-1 w-full">{children}</div>
      <FooterWidget />
    </div>
  );
};

export default NavAndFooter;
