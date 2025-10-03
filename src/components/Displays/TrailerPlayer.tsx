interface VideoPlayerProps {
  url?: string | null;
}

function TrailerPlayer({ url }: VideoPlayerProps) {
    if (!url) return null;
    
    return (
        <>
        <div className="w-[840px] h-[472px] rounded-md overflow-hidden">
        <video
        src={url}
        controls
        autoPlay={false}
        loop={false}
        className="w-full h-full object-cover"
      />
      </div>
        </>
    )
}

export default TrailerPlayer