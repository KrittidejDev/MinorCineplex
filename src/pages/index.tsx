import { Geist, Geist_Mono } from "next/font/google";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { toast } from "react-toastify";
import Step from "@/components/Steps/Step";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const testToast = () => {
    toast.success("Hello Techup");
  };

  useEffect(() => {
    testToast();
  }, []);

  return (
    <div
      className={`${geistSans.className} ${geistMono.className} font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20`}
    >
      <Button className="text-5xl bg-red-548  text-blue2EE p-10">
        Major Ticket Theme
      </Button>
    </div>
  );
}
