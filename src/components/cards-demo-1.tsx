"use client";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface CardDemoProps {
  image: string;
  video: string;
  text: string;
}

export default function CardDemo({ image, video, text }: CardDemoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Play video on hover
  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0; // restart from beginning
      videoRef.current.play();
    }
  };

  // Pause video on leave
  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <div
      className="w-full h-full group" // ✅ added `group` here
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={cn(
          "relative w-full h-full rounded-3xl overflow-hidden flex items-center justify-center cursor-pointer",
          "bg-cover bg-center transition-all duration-500 ease-out"
        )}
        style={{ backgroundImage: `url(${image})` }}
      >
        {/* Video */}
        <video
          ref={videoRef}
          src={video}
          className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          muted
          loop
          playsInline
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500"></div>

        {/* Text */}
        <h2 className="relative z-10 text-white text-2xl md:text-3xl font-semibold text-center px-4">
          {text}
        </h2>
      </div>
    </div>
  );
}
