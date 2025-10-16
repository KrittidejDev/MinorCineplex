"use client";

import { useRef, useState, useEffect } from 'react';
import { useElementInViewport } from '@/lib/hooks/useScrollPosition';

interface VideoPlayerProps {
  url?: string | null;
  className?: string;
  enablePIP?: boolean;
}

function TrailerPlayer({ url, className, enablePIP = true }: VideoPlayerProps) {
  const trailerRef = useRef<HTMLDivElement>(null);
  const isInViewport = useElementInViewport(trailerRef);
  const [isPIPMode, setIsPIPMode] = useState(false);

  // Sync video position เมื่อเปลี่ยน mode
  // ใช้ element เดียว ย้ายตำแหน่งเป็น PiP แทนการสร้าง player ใหม่

  useEffect(() => {
    if (!enablePIP || !trailerRef.current) return;

    if (!isInViewport && !isPIPMode) {
      setIsPIPMode(true);
    } else if (isInViewport && isPIPMode) {
      setIsPIPMode(false);
    }
  }, [isInViewport, isPIPMode, enablePIP]);

  // ถ้าไม่มี URL ให้ไม่แสดงอะไรเลย
  if (!url) return null;

  const autoplayUrl =
    url.includes("youtube.com") || url.includes("youtu.be")
      ? `${url}${url.includes("?") ? "&" : "?"}autoplay=1&mute=1`
      : url;

  return (
    <>
      {/* Video หลัก */}
      <div 
        ref={trailerRef}
        className={`${
          isPIPMode
            ? 'fixed bottom-6 right-6 z-50 w-80 h-[180px] rounded-lg overflow-hidden shadow-2xl border-2 border-white/20 backdrop-blur-sm pip-video-container'
            : 'w-full h-fit lg:w-[840px] aspect-video rounded-md overflow-hidden'
        } transition-all duration-300 ${className || ''}`}
      >
        <iframe
          src={url}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full block"
          title="Trailer Video"
        />
      </div>

    </>
  );
}

export default TrailerPlayer;
