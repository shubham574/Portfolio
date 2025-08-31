import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const VideoScrollComponent: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !videoContainerRef.current) return;

    const container = containerRef.current;
    const videoContainer = videoContainerRef.current;

    // Set initial state - child inherits parent size
    gsap.set(videoContainer, {
      width: '100%',
      height: '100%',
      borderRadius: '0px',
      margin: '0px',
    });

    // Create scroll-triggered animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      }
    });

    // Animate to rounded corners with margins
    tl.to(videoContainer, {
      width: 'calc(100% - 4rem)', // equivalent to mx-8 (2rem on each side)
      height: 'calc(100% - 4rem)', // equivalent to my-8
      borderRadius: '24px',
      margin: '2rem',
      duration: 1,
      ease: 'power2.out',
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <>
      {/* Main container with video */}
      <div 
        ref={containerRef}
        className="relative w-full h-screen bg-white overflow-hidden "
      >
        <div 
          ref={videoContainerRef}
          className="relative w-full h-full bg-black overflow-hidden"
          style={{ borderRadius: '0px' }}
        >
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source 
              src="/notion.mp4" 
              type="video/mp4" 
            />
            {/* Fallback for browsers that don't support video */}
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <p className="text-white text-2xl font-bold">Video </p>
            </div>
          </video>
        </div>
      </div>

    </>
  );
};

export default VideoScrollComponent;