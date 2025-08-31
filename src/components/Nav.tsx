"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTransitionRouter } from "next-view-transitions"
import { motion, AnimatePresence, Variants } from "framer-motion"
import { useEffect, useState, useRef, useCallback } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Register GSAP plugins only in browser
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const NAV_H = 88 // px – bigger navbar height and circle diameter

const Nav = () => {
  const router = useTransitionRouter()
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)

  // Throttled state update to avoid rapid toggles
  const throttledSetCollapsed = useCallback(
    (() => {
      let timeout: NodeJS.Timeout
      return (value: boolean) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => setIsCollapsed(value), 10)
      }
    })(),
    []
  )

  // Scroll → collapse to circle
  useEffect(() => {
    if (!navRef.current) return
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: "top -60",
        end: "max",
        onUpdate: (self) => {
          const down = self.direction === 1
          const up = self.direction === -1
          const p = self.progress
          if (down && p > 0.008 && !isCollapsed) throttledSetCollapsed(true)
          else if (up && p < 0.003 && isCollapsed) throttledSetCollapsed(false)
        },
      })
    }, navRef)
    return () => ctx.revert()
  }, [isCollapsed, throttledSetCollapsed])

  // Bubble → pill container animation (scale from center + width morph)
  const shellVariants: Variants = {
    expanded: {
      scale: 1,
      transition: { type: "spring", stiffness: 130, damping: 18, mass: 0.9 },
    },
    collapsed: {
      scale: 0.92, // subtle shrink to feel like a bubble
      transition: { type: "spring", stiffness: 220, damping: 26, mass: 0.9 },
    },
  }

  // Inner bar morphs width/shape (animated via layout)
  const barVariants: Variants = {
    expanded: {
      borderRadius: NAV_H / 2,
      paddingLeft: 28,
      paddingRight: 28,
      transition: { type: "spring", stiffness: 150, damping: 20 },
    },
    collapsed: {
      width: NAV_H,
      borderRadius: NAV_H / 2,
      paddingLeft: 0,
      paddingRight: 0,
      transition: { type: "spring", stiffness: 220, damping: 26 },
    },
  }

  // Menu content reveal (kept mounted to avoid flicker)
  const contentVariants: Variants = {
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.06 },
    },
    hidden: { opacity: 0.0 },
  }

  const itemVariants: Variants = {
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 22 } },
    hidden: { opacity: 0, y: 10 },
  }

  const hamburgerVariants: Variants = {
    visible: { opacity: 1, scale: 1, rotate: 0, transition: { type: "spring", stiffness: 240, damping: 16 } },
    hidden: { opacity: 0, scale: 0.7, rotate: 180, transition: { duration: 0.25 } },
  }

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

  const handleNavigation = (path: string) => (e: React.MouseEvent) => {
    if (pathname === path) return e.preventDefault()
    router.push(path, { onTransitionReady: triggerPageTransition })
  }

  const isActive = (path: string) => pathname === path

  // Hover handlers
  const onEnter = useCallback(() => setIsHovered(true), [])
  const onLeave = useCallback(() => setIsHovered(false), [])

  // Derived states
  const collapsed = isCollapsed && !isHovered
  const showHamburger = collapsed
  const showContent = !collapsed // expanded or hovered-expanded

  return (
    <motion.div
      ref={navRef}
      initial={false}
      variants={shellVariants}
      animate={collapsed ? "collapsed" : "expanded"}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50"
      style={{ transformOrigin: "center" }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {/* Inner bar (layout-animated) */}
      <motion.nav
        layout
        variants={barVariants}
        animate={collapsed ? "collapsed" : "expanded"}
        className="relative flex h-[88px] items-center justify-center 
                   bg-white/95 border border-gray-200/40 shadow-lg
                   rounded-full backdrop-blur-2xl
                   hover:shadow-2xl transition-shadow duration-500"
        style={{
          // Width grows to fit content automatically when expanded
          // Framer's `layout` animates this smoothly.
          minWidth: collapsed ? NAV_H : 560, // baseline for expanded size (can increase)
          WebkitBackdropFilter: "blur(24px)",
          backdropFilter: "blur(24px)",
        }}
        role="navigation"
        aria-label="Main navigation"
        aria-expanded={showContent}
      >
        {/* HAMBURGER (kept mounted; centered absolutely) */}
        <motion.div
          variants={hamburgerVariants}
          animate={showHamburger ? "visible" : "hidden"}
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          aria-hidden={!showHamburger}
        >
          <div className="flex flex-col items-center justify-center w-7 h-7">
            <span className="w-6 h-0.5 bg-gray-900 rounded-full mb-1" />
            <span className="w-6 h-0.5 bg-gray-900 rounded-full mb-1" />
            <span className="w-6 h-0.5 bg-gray-900 rounded-full" />
          </div>
        </motion.div>

        {/* NAV ITEMS (kept mounted; reveal via opacity + clip-path) */}
        <motion.div
          layout
          variants={contentVariants}
          animate={showContent ? "visible" : "hidden"}
          className="relative flex items-center gap-6 md:gap-8"
          style={{
            // reveal with a subtle wipe while collapsed
            clipPath: showContent
              ? "inset(0% 0% 0% 0% round 9999px)"
              : "inset(0% 50% 0% 50% round 9999px)",
            pointerEvents: showContent ? "auto" : "none",
          }}
        >
          {[{ href: "/", label: "Home" }, { href: "/services", label: "Services" }, { href: "/work", label: "Case studies" }].map(
            (link, i) => (
              <motion.div key={link.href} variants={itemVariants}>
                <Link
                  href={link.href}
                  onClick={handleNavigation(link.href)}
                  className={`text-base md:text-[17px] font-medium px-3 py-2 rounded-lg transition-all duration-300 
                              hover:text-blue-600 hover:bg-blue-50/70
                              ${isActive(link.href) ? "text-blue-600 bg-blue-50/60" : "text-gray-800"}`}
                >
                  {link.label}
                </Link>
              </motion.div>
            )
          )}

          <motion.div variants={itemVariants}>
            <Link
              href="/studio"
              onClick={handleNavigation("/studio")}
              className="px-16 py-8 bg-black text-white text-base md:text-[17px] font-semibold rounded-full
                         hover:bg-gray-800 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Contact me
            </Link>
          </motion.div>
        </motion.div>
      </motion.nav>
    </motion.div>
  )
}

export default Nav
