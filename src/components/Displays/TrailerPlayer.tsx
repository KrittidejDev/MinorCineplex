"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { Volume2, VolumeOff, Loader2 } from "lucide-react";

interface VideoPlayerProps {
  url?: string | null;
  className?: string;
  enablePIP?: boolean;
}

function TrailerPlayer({ url, className, enablePIP = true }: VideoPlayerProps) {
  const trailerRef = useRef<HTMLDivElement>(null);
  const fullIframeRef = useRef<HTMLIFrameElement>(null);
  const pipIframeRef = useRef<HTMLIFrameElement>(null);
  const [isPIPMode, setIsPIPMode] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const videoTimeRef = useRef<number>(0);
  const playerStateRef = useRef<number>(-1);
  const apiReadyRef = useRef<boolean>(false);

  // โหลด YouTube API
  useEffect(() => {
    if ((window as any).YT) return;
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // สลับ PiP เมื่อ scroll ออกจากจอ
  useEffect(() => {
    if (!enablePIP || !trailerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsPIPMode(!entry.isIntersecting);
        });
      },
      { threshold: [0, 0.7] }
    );

    observer.observe(trailerRef.current);
    return () => observer.disconnect();
  }, [enablePIP]);

  // รับ event จาก YouTube iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (typeof event.data !== "string") return;
      try {
        const data = JSON.parse(event.data);
        if (data.event === "onReady") {
          apiReadyRef.current = true;
          const iframe = isPIPMode
            ? pipIframeRef.current
            : fullIframeRef.current;
          iframe?.contentWindow?.postMessage(
            JSON.stringify({
              event: "command",
              func: isMuted ? "mute" : "unMute",
            }),
            "*"
          );
        } else if (
          data.event === "infoDelivery" &&
          data.info?.currentTime != null
        ) {
          videoTimeRef.current = data.info.currentTime;
        }
      } catch {}
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [isPIPMode, isMuted]);

  // URL ของ YouTube พร้อม origin
  const videoUrl = useMemo(() => {
    if (!url) return "";
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId =
        url.match(/(?:v=|\/embed\/|youtu\.be\/)([^&?\/]+)/)?.[1] || "";
      const origin =
        typeof window !== "undefined"
          ? `&origin=${window.location.origin}`
          : "";
      return `${url.includes("?") ? "&" : "?"}autoplay=1&enablejsapi=1&mute=1&loop=1&playlist=${videoId}${origin}`;
    }
    return url;
  }, [url]);

  const handleIframeLoad = useCallback(() => {
    setIsLoading(false);
    const iframe = isPIPMode ? pipIframeRef.current : fullIframeRef.current;
    if (iframe && apiReadyRef.current) {
      iframe.contentWindow?.postMessage(
        JSON.stringify({
          event: "command",
          func: isMuted ? "mute" : "unMute",
        }),
        "*"
      );
    }
  }, [isPIPMode, isMuted]);

  const toggleMute = useCallback(() => {
    const iframe = isPIPMode ? pipIframeRef.current : fullIframeRef.current;
    if (!iframe) return;
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    iframe.contentWindow?.postMessage(
      JSON.stringify({
        event: "command",
        func: newMuted ? "mute" : "unMute",
      }),
      "*"
    );
  }, [isMuted, isPIPMode]);

  if (!url) return null;

  return (
    <>
      {/* --- จอหลัก (Full mode) --- */}
      <div
        ref={trailerRef}
        className={`rounded-xl overflow-hidden relative w-full h-fit lg:w-[840px] transition-opacity duration-700 ease-in-out ${
          isPIPMode ? "opacity-0" : "opacity-100"
        } ${className || ""}`}
        style={{
          aspectRatio: "16 / 9",
          visibility: isPIPMode ? "hidden" : "visible",
        }}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-[5]">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        )}
        <iframe
          ref={fullIframeRef}
          src={url + videoUrl}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          onLoad={handleIframeLoad}
          className="w-full h-full"
        />
        <button
          onClick={toggleMute}
          className="absolute bottom-2 right-2 p-2 bg-balck/20 hover:bg-black/50 rounded-full text-white z-10 transition-all"
        >
          {isMuted ? <VolumeOff size={20} /> : <Volume2 size={20} />}
        </button>
      </div>

      {/* --- จอเล็ก (PiP mode) --- */}
      {enablePIP && (
        <div
          className={`fixed bottom-6 right-6 w-[400px] sm:w-[480px] rounded-xl overflow-hidden z-50 transition-all duration-700 ease-in-out  aspect-[16/9]  backdrop-blur-2xl saturate-150 shadow-[0_4px_20px_rgba(0,0,0,0.25)]  ${
            isPIPMode
              ? "opacity-80 translate-y-0"
              : "opacity-0 translate-y-6 pointer-events-none"
          }`}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-[5]">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
          <iframe
            ref={pipIframeRef}
            src={url + videoUrl}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            onLoad={handleIframeLoad}
            className="w-full h-full"
          />
          <div className="absolute inset-0 pointer-events-none">
            <button
              onClick={toggleMute}
              className="absolute bottom-2 right-2 p-2 bg-black/20 hover:bg-black/50 rounded-full text-white transition-all z-10 pointer-events-auto"
            >
              {isMuted ? <VolumeOff size={20} /> : <Volume2 size={20} />}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default TrailerPlayer;
