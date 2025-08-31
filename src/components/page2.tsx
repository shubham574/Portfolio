"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import localFont from "next/font/local";
import Image from "next/image";

const anzo = localFont({
  src: "../../public/anzo.woff2",
});

const Page2 = () => {
  gsap.registerPlugin(ScrollTrigger);

  useGSAP(() => {

      const mm = gsap.matchMedia();

      mm.add("(max-width: 480px)",()=>{
        gsap.from(".rotatetext", {
      transform: "rotateX(-80deg)",
      opacity: 0,
      duration: 1,
      stagger: 1,
      scrollTrigger: {
        trigger: ".rotatetext",
        start: "top 90%",
        end: "top -40%",
        scrub: 2,
        markers: true,
      },
    })
      })

    gsap.from(".rotatetext", {
      transform: "rotateX(-80deg)",
      opacity: 0,
      duration: 1,
      stagger: 1,
      scrollTrigger: {
        trigger: ".rotatetext",
        start: "top 80%",
        end: "top -380%",
        scrub: 2,
        markers: true,
      },
    });
  });

  // Paste brand logo paths here (files must be under /public)
  // Example: /public/brands/logo1.png => "/brands/logo1.png"
  const logos: string[] = [
    "/logo1.png",
    "/logo2.png",
    "/logo3.png",
    "/logo4.png",
  ];

  // Filter out invalid entries to prevent runtime errors
  const validLogos = logos.filter((p) => typeof p === "string" && p.startsWith("/"));

  return (
    <>
      <div
        id="section2"
        className="bg-white text-center text-black object-cover w-full"
      >
        <div className={`rotatetext mt-20 ${anzo.className}`}>
          <h1 className="text-[45vw] xs:text-[4.5rem]  text-black uppercase leading-[40vw]">
            IMPACTFUL
          </h1>
        </div>
        <div className={`rotatetext ${anzo.className}`}>
          <h1 className="text-[45vw] xs:text-[4.5rem] text-black uppercase leading-[40vw]">
            Design
          </h1>
        </div>
        <div className={`rotatetext ${anzo.className}`}>
          <h1 className="text-[45vw] xs:text-[4.5rem] text-black uppercase leading-[40vw]">
            Is the
          </h1>
        </div>
        <div className={`rotatetext ${anzo.className}`}>
          <h1 className="text-[45vw] xs:text-[4.5rem] text-black uppercase leading-[40vw]">
            Design
          </h1>
        </div>
        <div className={`rotatetext ${anzo.className}`}>
          <h1 className="text-[45vw] xs:text-[4.5rem] text-black uppercase leading-[40vw]">
            That
          </h1>
        </div>
        <div className={`rotatetext ${anzo.className}`}>
          <h1 className="text-[45vw] xs:text-[4.5rem] text-black uppercase leading-[40vw]">
            Work
          </h1>
        </div>
      <section className=" py-16 ">
        
        <div className="flex flex-wrap justify-center gap-10">
          {validLogos.map((logo, index) => (
            <div key={index} className="h-16 w-32 flex items-center justify-center">
             
              <Image
                src={logo}
                alt={`Brand Logo ${index + 1}`}
                width={128} // 32 * 4
                height={64} // 16 * 4
                className="object-contain"
                priority={index < 4}
              />
            </div>
          ))}
        </div>
      </section>
      </div>

      {/* Brand Logos Section */}
    </>
  );
};

export default Page2;
