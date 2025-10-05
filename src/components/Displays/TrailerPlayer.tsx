interface VideoPlayerProps {
  url?: string | null;
  className?: string;
}

function TrailerPlayer({ url, className }: VideoPlayerProps) {
  if (!url) return null;

  return (
    <div className={`w-full h-fit lg:w-[840px] aspect-video rounded-md overflow-hidden ${className || ""}`}>
      <iframe
        src={url}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full block"
      />
    </div>
  );
}

export default TrailerPlayer;
