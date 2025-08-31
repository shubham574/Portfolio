"use client";
import React, { useRef } from "react";
import ImageCursorTrail from "./ui/image-cursortrail";
import localFont from "next/font/local";

const mori = localFont({
  src: "../../public/fonts/Mori-Regular.otf",
});

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroContainerRef = useRef<HTMLDivElement>(null);

  const images: string[] = [
    "https://images.pexels.com/photos/30082445/pexels-photo-30082445.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.unsplash.com/photo-1692606743169-e1ae2f0a960f?q=80&w=3560&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1709949908058-a08659bfa922?q=80&w=1200&auto=format",
    "https://images.unsplash.com/photo-1548192746-dd526f154ed9?q=80&w=1200&auto=format",
    "https://images.unsplash.com/photo-1644141655284-2961181d5a02?q=80&w=3000&auto=format&fit=crop",
    "https://assets.lummi.ai/assets/QmNfwUDpehZyLWzE8to7QzgbJ164S6fQy8JyUWemHtmShj?auto=format&w=1500",
    "https://images.unsplash.com/photo-1706049379414-437ec3a54e93?q=80&w=1200&auto=format",
    "https://assets.lummi.ai/assets/Qmb2P6tF2qUaFXnXpnnp2sk9HdVHNYXUv6MtoiSq7jjVhQ?auto=format&w=1500",
    "https://images.unsplash.com/photo-1508873881324-c92a3fc536ba?q=80&w=1200&auto=format",
  ];

  const services: string[] = [
    "Branding",
    "Prototyping",
    "Visual Front-End Development",
    "Back-End Development",
    "AI Integration",
    "Motion Design",
    "UX Design",
  ];

  return (
    <>
      <style jsx>{`
        @keyframes infiniteScroll {
          from {
            transform: translateX(0%);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .scroll-container {
          overflow: hidden;
          white-space: nowrap;
        }

        .scroll-content {
          display: inline-flex;
          animation: infiniteScroll 40s linear infinite;
          will-change: transform;
        }

        .scroll-item {
          display: inline-block;
          margin-right: 3rem;
          white-space: nowrap;
        }
      `}</style>

      <div
        ref={containerRef}
        className="relative w-full h-[100vh] bg-white flex items-center justify-center p-8"
      >
        {/* Hero container */}
        <div
          ref={heroContainerRef}
          className="flex flex-col justify-between items-start rounded-3xl p-8 sm:p-8 md:p-12 relative"
          style={{
            width: "calc(100% - 4rem)",
            height: "calc(100% - 4rem)",
            backgroundColor: "#E53E3E",
          }}
        >
          {/* Cursor Trail */}
          <ImageCursorTrail
            items={images}
            maxNumberOfImages={5}
            distance={25}
            imgClass="sm:w-40 w-28 sm:h-48 h-36"
          >
            <div className={`w-full h-full flex flex-col ${mori.className}`}>
              {/* Main heading */}
              <div className="flex-1 flex items-center w-full">
                <h1 className="text-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.15] tracking-tight max-w-5xl">
                  To put it simply, you can rent our talented experts or an
                  entire team on a short-term or long-term basis to help you
                  design, build, and launch your project.
                </h1>
              </div>

              {/* Divider + Scrolling text */}
              <div className="absolute bottom-0 left-0 w-full">
                <div className="w-full border-t border-black/20 mb-3"></div>
                <div className="scroll-container px-8 pb-4">
                  <div className="scroll-content text-black text-lg md:text-lg font-bold opacity-75">
                    {[...services, ...services].map((service, index) => (
                      <span key={index} className="scroll-item">
                        {service}.
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ImageCursorTrail>
        </div>
      </div>
    </>
  );
}
