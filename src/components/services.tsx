"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import localFont from "next/font/local";

const mori = localFont({
  src: "../../public/fonts/Mori-Regular.otf",
});

gsap.registerPlugin(ScrollTrigger);

interface Service {
  id: number;
  title: string;
  description: string;
}

const services: Service[] = [
  {
    id: 1,
    title: "Functional Web and Mobile Apps.",
    description:
      "Robust, scalable, and user-friendly apps tailored for your business.",
  },
  {
    id: 2,
    title: "Mindfully Structured Design Systems.",
    description:
      "Consistent and reusable design systems for faster product scaling.",
  },
  {
    id: 3,
    title: "Lovely Clickable Design Prototypes.",
    description:
      "Interactive prototypes that bring your ideas to life before development.",
  },
  {
    id: 4,
    title: "Efficient Automated Testing.",
    description:
      "Seamless testing pipelines ensuring quality and reliability.",
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  useEffect(() => {
  if (sectionRef.current) {
    const targets = sectionRef.current.querySelectorAll(".reveal-text");

    gsap.fromTo(
      targets,
      { yPercent: 100, opacity: 0 }, // start below its own position
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 90%",
          scrub: true
        },
      }
    );
  }
}, []);


  return (
    <section
      ref={sectionRef}
      id="services"
      className={`relative w-full min-h-screen py-20 flex flex-col justify-center bg-white ${mori.className}`}
    >
      {/* Content */}
      <div className="relative z-10 text-black pl-16 md:pl-32">
        <h2
          className="reveal-text text-3xl md:text-5xl font-bold max-w-4xl leading-snug mb-10" style={{paddingBottom:35, paddingLeft:35 }}
        >
          With two decades of experience, companies worldwide trusted and hired
          us to handle various digital aspects of their businesses.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-16 pl-16 md:pl-32">
          {services.map((service) => (
            <div
              key={service.id}
              className="reveal-text cursor-pointer"
              onMouseEnter={() => setHoveredId(service.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Reserve consistent height */}
              <div className="p-4 rounded-lg transition-all duration-500 min-h-[140px]">
                <div className="flex items-center gap-6 relative">
                  <span className="text-gray-400 font-semibold text-xl w-20 left-10 relative">
                    {service.id.toString().padStart(2, "0")}
                  </span>
                  <span
                    className={`font-semibold transition-all duration-500 ${
                      hoveredId === service.id
                        ? "text-3xl text-black"
                        : "text-2xl text-gray-700"
                    }`}
                  >
                    {service.title}
                  </span>
                </div>

                {/* Description */}
                <div className="ml-16 mt-2 min-h-[48px] left-26 relative">
                  <p
                    className={`text-gray-600 text-base max-w-md leading-relaxed transition-all duration-500 ease-out ${
                      hoveredId === service.id
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-3"
                    }`}
                  >
                    {service.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
