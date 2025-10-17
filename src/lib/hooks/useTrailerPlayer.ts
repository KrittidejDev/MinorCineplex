"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";

export function useTrailerPlayer(url?: string | null, enablePIP = true) {
  const trailerRef = useRef<HTMLDivElement>(null);
  const fullIframeRef = useRef<HTMLIFrameElement>(null);
  const pipIframeRef = useRef<HTMLIFrameElement>(null);
  const [isPIPMode, setIsPIPMode] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const videoTimeRef = useRef<number>(0);
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

  return {
    refs: { trailerRef, fullIframeRef, pipIframeRef },
    states: { isPIPMode, isMuted, isLoading },
    actions: { toggleMute, handleIframeLoad },
    videoUrl,
  };
}
