interface VideoPlayerProps {
  url?: string | null;
}

function TrailerPlayer({ url }: VideoPlayerProps) {
  if (!url) return null;

  return (
    <div className="w-[840px] h-[472px] rounded-md overflow-hidden">
      <iframe
        src={url}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  );
}

export default TrailerPlayer;
