"use client";

import { useTrailerPlayer } from "@/lib/hooks/useTrailerPlayer";
import { Volume2, VolumeOff, Loader2 } from "lucide-react";

interface VideoPlayerProps {
  url?: string | null;
  className?: string;
  enablePIP?: boolean;
}

function TrailerPlayer({ url, className, enablePIP = true }: VideoPlayerProps) {
  const {
    refs: { trailerRef, fullIframeRef, pipIframeRef },
    states: { isPIPMode, isMuted, isLoading },
    actions: { toggleMute, handleIframeLoad },
    videoUrl,
  } = useTrailerPlayer(url, enablePIP);

  if (!url) return null;

  return (
    <>
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
          className="absolute bottom-2 right-2 p-2 bg-black/20 hover:bg-black/50 rounded-full text-white z-10 transition-all"
        >
          {isMuted ? <VolumeOff size={20} /> : <Volume2 size={20} />}
        </button>
      </div>

      {enablePIP && (
        <div
          className={`fixed bottom-6 right-6 w-[400px] sm:w-[480px] rounded-xl overflow-hidden z-50 transition-all duration-700 ease-in-out aspect-[16/9] backdrop-blur-2xl saturate-150 shadow-[0_4px_20px_rgba(0,0,0,0.25)] ${
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
