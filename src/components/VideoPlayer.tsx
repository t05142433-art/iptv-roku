import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Maximize, Minimize, X, Volume2, VolumeX } from 'lucide-react';

interface VideoPlayerProps {
  url: string;
  title: string;
  onClose: () => void;
  onProgress?: (time: number) => void;
  initialTime?: number;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, title, onClose, onProgress, initialTime = 0 }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported() && url.includes('.m3u8')) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (initialTime > 0) video.currentTime = initialTime;
        video.play();
      });
      return () => hls.destroy();
    } else {
      video.src = url;
      video.onloadedmetadata = () => {
        if (initialTime > 0) video.currentTime = initialTime;
        video.play();
      };
    }
  }, [url, initialTime]);

  const togglePlay = () => {
    if (videoRef.current?.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current?.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration);
      onProgress?.(videoRef.current.currentTime);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => setShowControls(false), 3000);
  };

  const formatTime = (time: number) => {
    const h = Math.floor(time / 3600);
    const m = Math.floor((time % 3600) / 60);
    const s = Math.floor(time % 60);
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black z-[100] flex items-center justify-center group"
      onMouseMove={handleMouseMove}
      onClick={handleMouseMove}
    >
      <video 
        ref={videoRef}
        className="w-full h-full"
        onTimeUpdate={handleTimeUpdate}
        onClick={togglePlay}
      />

      <AnimatePresence>
        {showControls && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 flex flex-col justify-between p-8"
          >
            {/* Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white drop-shadow-lg">{title}</h2>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-8 h-8" />
              </button>
            </div>

            {/* Bottom Controls */}
            <div className="space-y-6">
              {/* Progress Bar */}
              <div className="relative w-full h-2 bg-white/20 rounded-full cursor-pointer overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-primary"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-8">
                  <button onClick={() => videoRef.current && (videoRef.current.currentTime -= 10)}>
                    <SkipBack className="w-8 h-8" />
                  </button>
                  <button onClick={togglePlay} className="p-4 bg-white text-black rounded-full hover:scale-110 transition-transform">
                    {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                  </button>
                  <button onClick={() => videoRef.current && (videoRef.current.currentTime += 10)}>
                    <SkipForward className="w-8 h-8" />
                  </button>
                  <span className="font-mono text-lg">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-6">
                  <button onClick={() => setIsMuted(!isMuted)}>
                    {isMuted ? <VolumeX className="w-8 h-8" /> : <Volume2 className="w-8 h-8" />}
                  </button>
                  <button onClick={toggleFullscreen}>
                    {isFullscreen ? <Minimize className="w-8 h-8" /> : <Maximize className="w-8 h-8" />}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
