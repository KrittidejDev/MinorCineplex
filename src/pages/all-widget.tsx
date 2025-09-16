import { Button } from "@/components/ui/button";
import React from "react";

const AllWidget = () => {
  return (
    <div className="flex flex-row gap-10 justify-center items-center py-10">
      <div className="flex flex-col gap-10">
        <Button
          className="w-[123px] h-12 bg-[hsla(223,82%,62%,1)] text-white font-roboto-condensed font-bold text-base leading-6 rounded px-10 py-3 gap-1.5 hover:bg-[hsla(223,82%,52%,1)] active:bg-[#0e1c80] transition-colors"
          style={{ fontFamily: 'var(--font-roboto-condensed)' }}
        >
          Button
        </Button>

        <Button
          className="w-[123px] h-12 bg-[hsla(223,82%,52%,1)] text-white font-roboto-condensed font-bold text-base leading-6 rounded px-10 py-3 gap-1.5 hover:[hsla(235,70%,39%,1)] active:bg-[hsla(223,82%,52%,1)] transition-colors"
          style={{ fontFamily: 'var(--font-roboto-condensed)' }}
        >
          Button
        </Button>

        <Button
          className="w-[123px] h-12 bg-[#0e1c80] text-white font-roboto-condensed font-bold text-base leading-6 rounded px-10 py-3 gap-1.5 hover:[hsla(235,70%,39%,1)] active:bg-[hsla(223,82%,52%,1)] transition-colors"
          style={{ fontFamily: 'var(--font-roboto-condensed)' }}
        >
          Button
        </Button>

        <Button
          className="w-[123px] h-12 bg-[hsla(223,82%,62%,1)] text-white font-roboto-condensed font-bold text-base leading-6 rounded px-10 py-3 gap-1.5 hover:bg-[hsla(223,82%,52%,1)] active:bg-[#0e1c80] transition-colors opacity-50"
          style={{ fontFamily: 'var(--font-roboto-condensed)' }}
        >
          Button
        </Button>
      </div>
      <div className="flex flex-col gap-10">
        <Button
          className="w-[123px] h-12 bg-transparent border border-white text-white font-roboto-condensed font-bold text-base leading-6 rounded px-10 py-3 gap-1.5 hover:bg-[hsla(227,19%,62%,1)] active:bg-slate-600 active:border-0  transition-colors "
          style={{ fontFamily: 'var(--font-roboto-condensed)' }}
        >
          Button
        </Button>

        <Button
          className="w-[123px] h-12 bg-[hsla(227,19%,62%,1)] text-white font-roboto-condensed font-bold text-base leading-6 rounded px-10 py-3 gap-1.5 hover:[hsla(235,70%,39%,1)] active:bg-[hsla(223,82%,52%,1)] transition-colors"
          style={{ fontFamily: 'var(--font-roboto-condensed)' }}
        >
          Button
        </Button>

        <Button
          className="w-[123px] h-12 bg-slate-600 text-white font-roboto-condensed font-bold text-base leading-6 rounded px-10 py-3 gap-1.5 hover:[hsla(235,70%,39%,1)] active:bg-[hsla(223,82%,52%,1)] transition-colors"
          style={{ fontFamily: 'var(--font-roboto-condensed)' }}
        >
          Button
        </Button>

        <Button
          className="w-[123px] h-12 bg-transparent border border-white text-white font-roboto-condensed font-bold text-base leading-6 rounded px-10 py-3 gap-1.5 hover:bg-[hsla(227,19%,62%,1)] active:bg-[hsla(223,82%,62%,0.2)] active:border-0  transition-colors opacity-50"
          style={{ fontFamily: 'var(--font-roboto-condensed)' }}
        >
          Button
        </Button>
      </div>
      <div className="flex flex-col gap-10">
        
        <Button
          className="w-[123px] h-12 bg-transparent  text-white font-roboto-condensed font-bold text-base leading-6 rounded px-10 py-3 gap-1.5 hover:opacity-50 active:opacity-40 transition-colors underline"
          style={{ fontFamily: 'var(--font-roboto-condensed)' }}
        >
          Button
        </Button>

        <Button
          className="w-[123px] h-12 bg-transparent  text-white font-roboto-condensed font-bold text-base leading-6 rounded px-10 py-3 gap-1.5 hover:bg-[hsla(223,82%,62%,0.1)] active:bg-[hsla(223,82%,62%,0.2)] transition-colors underline opacity-50"
          style={{ fontFamily: 'var(--font-roboto-condensed)' }}
        >
          Button
        </Button>

        <Button
          className="w-[123px] h-12 bg-transparent  text-white font-roboto-condensed font-bold text-base leading-6 rounded px-10 py-3 gap-1.5 hover:bg-[hsla(223,82%,62%,0.1)] active:bg-[hsla(223,82%,62%,0.2)] transition-colors underline opacity-40"
          style={{ fontFamily: 'var(--font-roboto-condensed)' }}
        >
          Button
        </Button>

        <Button
          className="w-[123px] h-12 bg-transparent  text-white font-roboto-condensed font-bold text-base leading-6 rounded px-10 py-3 gap-1.5 hover:bg-[hsla(223,82%,62%,0.1)] active:bg-[hsla(223,82%,62%,0.2)] transition-colors underline opacity-30"
          style={{ fontFamily: 'var(--font-roboto-condensed)' }}
        >
          Button
        </Button>
      </div>
    </div>
  );
};

export default AllWidget;
