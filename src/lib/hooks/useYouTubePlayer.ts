import { useEffect, useRef, useState } from 'react';

interface YouTubePlayerState {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  volume: number;
}

export const useYouTubePlayer = (videoId: string, isActive: boolean, playerType: 'main' | 'pip' = 'main') => {
  const playerRef = useRef<any>(null);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [playerState, setPlayerState] = useState<YouTubePlayerState>({
    currentTime: 0,
    duration: 0,
    isPlaying: false,
    volume: 100
  });

  useEffect(() => {
    if (!videoId || !isActive) return;

    // Load YouTube IFrame Player API
    const loadYouTubeAPI = () => {
      if (window.YT && window.YT.Player) {
        initializePlayer();
      } else {
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.async = true;
        document.body.appendChild(script);

        window.onYouTubeIframeAPIReady = () => {
          initializePlayer();
        };
      }
    };

    const initializePlayer = () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }

      const playerId = `youtube-player-${videoId}-${playerType}`;
      playerRef.current = new window.YT.Player(playerId, {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: 1,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          enablejsapi: 1
        },
        events: {
          onReady: () => {
            setIsReady(true);
          },
          onStateChange: (event: any) => {
            const isPlaying = event.data === window.YT.PlayerState.PLAYING;
            setPlayerState(prev => ({ ...prev, isPlaying }));
          },
          onPlaybackRateChange: (event: any) => {
            // Handle playback rate changes
          }
        }
      });
    };

    loadYouTubeAPI();

    // Poll for current time updates
    const interval = setInterval(() => {
      try {
        if (
          isReady &&
          playerRef.current &&
          typeof playerRef.current.getCurrentTime === 'function'
        ) {
          const currentTime = playerRef.current.getCurrentTime();
          const duration = typeof playerRef.current.getDuration === 'function' ? playerRef.current.getDuration() : 0;
          const volume = typeof playerRef.current.getVolume === 'function' ? playerRef.current.getVolume() : 100;

          setPlayerState(prev => ({
            ...prev,
            currentTime,
            duration,
            volume
          }));
        }
      } catch {
        // ignore transient readiness errors
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoId, isActive, playerType, isReady]);

  const syncWithPlayer = (targetPlayer: any) => {
    if (!playerRef.current || !targetPlayer) return;

    const currentTime = playerRef.current.getCurrentTime();
    const isPlaying = playerRef.current.getPlayerState() === window.YT.PlayerState.PLAYING;

    targetPlayer.seekTo(currentTime, true);
    if (isPlaying) {
      targetPlayer.playVideo();
    } else {
      targetPlayer.pauseVideo();
    }
  };

  const getCurrentTime = () => {
    try {
      if (isReady && playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        return playerRef.current.getCurrentTime();
      }
    } catch {}
    return 0;
  };

  const isPlaying = () => {
    try {
      return (
        isReady &&
        playerRef.current?.getPlayerState &&
        playerRef.current.getPlayerState() === window.YT.PlayerState.PLAYING
      );
    } catch {
      return false;
    }
  };

  return {
    playerRef,
    playerState,
    syncWithPlayer,
    getCurrentTime,
    isPlaying,
    isReady
  };
};

// Extend Window interface for YouTube API
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}
