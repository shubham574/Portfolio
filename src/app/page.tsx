"use client"
import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Variants } from "framer-motion"
import { usePathname } from "next/navigation"
import { useTransitionRouter } from "next-view-transitions"
import { useRevealer } from "@/hooks/useRevealer"
import Nav from "@/components/Nav"
import Scroll from "@/components/horizontalScroll"
import Page4 from "@/components/page4"
import Page2 from "@/components/page2"
import InfiniteCardsPage from "@/components/testimonialCard"
import VideoScrollComponent from "@/components/page3"
import localFont from "next/font/local"
import Services from "@/components/services"
import Image from "next/image"

const mori = localFont({
  src: "../../public/fonts/Mori-Regular.otf",
})

const textVariants: Variants = {
  hidden: { y: 40, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
}

// Circular Progress Component
const ScrollCircle = ({
  progress,
  onComplete,
}: {
  progress: number
  onComplete: () => void
}) => {
  const radius = 30
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = circumference

  const validProgress = isNaN(progress) ? 0 : progress
  const strokeDashoffset = circumference - (validProgress / 100) * circumference

  useEffect(() => {
    if (validProgress >= 100) {
      onComplete()
    }
  }, [validProgress, onComplete])

  return (
    <div className="fixed top-1/2 z-40 transform -translate-y-1/2 right-2 sm:right-4 md:right-6 lg:right-8 xl:right-10 2xl:right-12">
      <div className="relative w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 70 70">
          <circle
            cx="35"
            cy="35"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="2"
            fill="transparent"
          />
          <motion.circle
            cx="35"
            cy="35"
            r={radius}
            stroke="#8b5cf6"
            strokeWidth="2"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.1, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-semibold text-purple-600 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
            {Math.round(validProgress)}
          </span>
        </div>
      </div>
    </div>
  )
}

const Page = () => {
  const revealerDone = useRevealer()
  const router = useTransitionRouter()
  const pathname = usePathname()
  const [scrollProgress, setScrollProgress] = useState(0)

  const lines = ["Welcome!", "From designers to", "developers, we've", "got you covered." ]

  useEffect(() => {
   
    let overscrollProgress = 95
    let lastWheelTime = 0
    const WHEEL_COOLDOWN = 350 // ms between valid increments
    const INCREMENT = 2 // progress gained per attempt

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || 0
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight

      if (docHeight <= 0) {
        setScrollProgress(0)
        return
      }

      let scrollPercent = (scrollTop / docHeight) * 100
      scrollPercent = Math.min(scrollPercent, 95)
      setScrollProgress(scrollPercent)

      // Reset overscroll if user scrolls up
      if (scrollPercent < 95) {
        overscrollProgress = 95
      }
    }

    const handleWheel = (e: WheelEvent) => {
      const bottomReached =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2

      if (bottomReached && e.deltaY > 0) {
        const now = Date.now()
        if (now - lastWheelTime > WHEEL_COOLDOWN) {
          lastWheelTime = now
          overscrollProgress = Math.min(100, overscrollProgress + INCREMENT)
          setScrollProgress(overscrollProgress)
        }
      }
    }

    // init
    handleScroll()

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("wheel", handleWheel, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("wheel", handleWheel)
    }
  }, [])

  function triggerPageTransition() {
    document.documentElement.animate(
      [
        { clipPath: "polygon(25% 75%, 75% 75%, 75% 75%, 25% 75%)" },
        { clipPath: "polygon(0 100%, 100% 100%, 100% 0%, 0% 0%)" },
      ],
      {
        duration: 2000,
        easing: "cubic-bezier(0.9, 0, 0.1, 1)",
        pseudoElement: "::view-transition-new(root)",
      }
    )
  }

  const handleNavigation = (path: string) => {
    if (pathname === path) return
    router.push(path, { onTransitionReady: triggerPageTransition })
  }

  const handleCircleComplete = () => {
    handleNavigation("/work")
  }

  const BgImg = "/bg.png"

  return (
    <>
      <div className="revealer fixed inset-0 bg-purple-600 origin-top z-50"></div>

      {revealerDone && (
        <>
          <Nav />

          <ScrollCircle
            progress={scrollProgress}
            onComplete={handleCircleComplete}
          />

          <div className="overflow-hidden">
            <main className="relative bg-white text-black h-[100vh]">
              <div className="absolute inset-0 z-0 hidden md:block pointer-events-none">
                <div className="relative w-full h-full">
                  <Image
                    src={BgImg}
                    alt="Background visual"
                    fill
                    priority
                    className="object-cover"
                    sizes="100vw"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `
                        radial-gradient(ellipse at center, transparent 10%, rgba(255,255,255,0.3) 40%, rgba(255,255,255,0.7) 70%, rgba(255,255,255,0.9) 90%),
                        linear-gradient(to right, rgba(255,255,255,0.8) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.8) 100%),
                        linear-gradient(to bottom, rgba(255,255,255,0.6) 0%, transparent 20%, transparent 80%, rgba(255,255,255,0.6) 100%)
                      `,
                    }}
                  />
                </div>
              </div>

              <section
                className="
                  relative z-10
                  h-full grid
                  grid-cols-1
                  md:grid-cols-[1.2fr_1fr]
                  items-center
                  gap-3 sm:gap-6 md:gap-8
                  px-3 xs:px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20
                "
              >
                {/* Left text */}
                <div className="relative left-20 top-20 flex items-center justify-center md:justify-start">
                  <div
                    className={`
                      text-center  ml-8 sm:ml-6 md:ml-10 lg:ml-12 xl:ml-16 2xl:ml-20
                      font-extrabold leading-[1.05] tracking-tight
                      text-[clamp(2.5rem,8vw,4rem)]
                      sm:text-[clamp(3rem,7vw,4.5rem)]
                      md:text-[clamp(2.75rem,5vw,4.5rem)]
                      lg:text-[clamp(3.25rem,4.5vw,5.5rem)]
                      xl:text-[clamp(3.5rem,4vw,6.5rem)]
                      2xl:text-[clamp(3.75rem,3.5vw,7.5rem)]
                      ${mori.className}
                    `}
                  >
                    {lines.map((line, i) => (
                      <motion.div
                        key={i}
                        custom={i}
                        initial="hidden"
                        animate="visible"
                        variants={textVariants}
                      >
                        {line}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Right side image placeholder */}
                <div className="hidden md:block relative h-[60dvh] sm:h-[100dvh] md:h-[90%] lg:h-[95%] rounded-xl overflow-hidden"></div>
              </section>
            </main>

            <Page2 />
            <InfiniteCardsPage />
            <Page4 />
            <Scroll />
            <Services />
            <VideoScrollComponent />
          </div>
        </>
      )}
    </>
  )
}

export default Page
