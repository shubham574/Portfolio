"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import localFont from "next/font/local";

const mori = localFont({
  src: "../../../public/fonts/Mori-Regular.otf"
});

interface CaseStudy {
  id: number;
  title: string;
  image: string;
  link: string;
  category: string;
}

const CaseStudiesPage = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  gsap.registerPlugin(ScrollTrigger);

  const caseStudies: CaseStudy[] = [
    {
      id: 1,
      title: "E-commerce Revolution",
      image:
        "https://images.unsplash.com/photo-1714974528737-3e6c7e4d11af?q=80&w=1332&auto=format&fit=crop",
      link: "/case-studies/ecommerce",
      category: "E-commerce"
    },
    {
      id: 2,
      title: "FinTech Innovation",
      image:
        "https://images.unsplash.com/photo-1651764731778-b9c40c51334f?q=80&w=2070&auto=format&fit=crop",
      link: "/case-studies/fintech",
      category: "Finance"
    },
    {
      id: 3,
      title: "Healthcare Platform",
      image:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=2070&auto=format&fit=crop",
      link: "/case-studies/healthcare",
      category: "Healthcare"
    },
    {
      id: 4,
      title: "Education Portal",
      image:
        "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=2070&auto=format&fit=crop",
      link: "/case-studies/education",
      category: "Education"
    },
    {
      id: 5,
      title: "Social Impact App",
      image:
        "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=2069&auto=format&fit=crop",
      link: "/case-studies/social-impact",
      category: "Social Impact"
    }
  ];

  useGSAP(() => {
    // Track which card is active while scrolling
    caseStudies.forEach((_, i) => {
      ScrollTrigger.create({
        trigger: `.case-card-${i}`,
        start: "top center",
        end: "bottom center",
        onEnter: () => setCurrentIndex(i),
        onEnterBack: () => setCurrentIndex(i)
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white relative flex">
      {/* Sticky Number on Left */}
      <div className="sticky top-0 h-screen flex items-center justify-center w-[200px]">
        <span
          className={`text-[12rem] font-extrabold text-gray-100 select-none ${mori.className}`}
        >
          {String(currentIndex + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Cards Section */}
      <div className="flex-1">
        {caseStudies.map((caseStudy, index) => (
          <div
            key={caseStudy.id}
            className={`case-card-${index} min-h-screen flex items-center justify-center px-8 md:px-16 lg:px-24 py-20`}
          >
            <div className="case-card w-full max-w-4xl relative z-10">
              <div
                onClick={() => router.push(caseStudy.link)}
                className="relative bg-white rounded-[2.5rem] shadow-2xl cursor-pointer overflow-hidden group hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] mx-auto min-h-[480px] flex items-center justify-center"
              >
                {/* Background Image */}
                <Image
                  src={caseStudy.image}
                  alt={caseStudy.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="100vw"
                />

                {/* Dark overlay for readability */}
                <div className="absolute inset-0 bg-black/40" />

                {/* Title */}
                <h2
                  className={`absolute z-10 text-3xl md:text-5xl font-bold text-white text-center px-4 ${mori.className}`}
                >
                  {caseStudy.title}
                </h2>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CaseStudiesPage;
