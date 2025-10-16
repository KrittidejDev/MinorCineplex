interface VideoPlayerProps {
  url?: string | null;
  className?: string;
}

function TrailerPlayer({ url, className }: VideoPlayerProps) {
  if (!url) return null;

  const autoplayUrl =
    url.includes("youtube.com") || url.includes("youtu.be")
      ? `${url}${url.includes("?") ? "&" : "?"}autoplay=1&mute=1`
      : url;

  return (
    <div
      className={`w-full h-fit lg:w-[840px] aspect-video rounded-md overflow-hidden ${className || ""}`}
    >
      <iframe
        src={autoplayUrl}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full block"
      />
    </div>
  );
}

export default TrailerPlayer;
