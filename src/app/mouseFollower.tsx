"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

/**
 * MouseFollower
 * - Default small glowing circle (8-12px)
 * - Trailing spring/elastic motion (gsap.quickTo for performance)
 * - Hover over <a>, <button>, or .cursor-hover -> enlarge to ring with subtle border
 * - Uses Tailwind for styling (no plain CSS)
 */

export default function MouseFollower() {
  const elRef = useRef<HTMLDivElement | null>(null);
  const hoverTargetsRef = useRef<Element[]>([]);
  const removeListenersRef = useRef<(() => void)[]>([]);
  const mutateObserverRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    // initial visual (we animate via GSAP / Framer Motion)
    gsap.set(el, {
      x: 0,
      y: 0,
      scale: 1,
      backgroundColor: "rgba(59,130,246,0.7)", // tailwind blue-500/70
      border: "0px solid rgba(59,130,246,0)",
      // enable GPU for transform
      force3D: true,
    });

    // quick setters for performant transform animation
    const setX = gsap.quickTo(el, "x", {
      duration: 0.7,
      ease: "elastic.out(1, 0.35)",
    });
    const setY = gsap.quickTo(el, "y", {
      duration: 0.7,
      ease: "elastic.out(1, 0.35)",
    });

    // move handler
    const onMove = (e: MouseEvent) => {
      // set x/y such that the element's center sits on cursor
      // because we use translate(-50%,-50%) in markup, setting x/y to clientX, clientY works visually.
      setX(e.clientX);
      setY(e.clientY);
    };

    // add hover listeners to elements matching selectors
    const addHoverListeners = (root: ParentNode = document) => {
      const nodes = Array.from(
        (root as Document | Element).querySelectorAll("a, button, .cursor-hover")
      );
      // remove duplicates
      const newNodes = nodes.filter((n) => !hoverTargetsRef.current.includes(n));
      newNodes.forEach((node) => {
        const onEnter = () => {
          gsap.to(el, {
            scale: 2,
            duration: 0.45,
            ease: "elastic.out(1, 0.35)",
            backgroundColor: "transparent",
            border: "2px solid rgba(59,130,246,0.95)", // subtle blue ring
          });
        };
        const onLeave = () => {
          gsap.to(el, {
            scale: 1,
            duration: 0.45,
            ease: "elastic.out(1, 0.35)",
            backgroundColor: "rgba(59,130,246,0.7)",
            border: "0px solid rgba(59,130,246,0)",
          });
        };

        node.addEventListener("mouseenter", onEnter);
        node.addEventListener("mouseleave", onLeave);

        // save for cleanup
        removeListenersRef.current.push(() => {
          node.removeEventListener("mouseenter", onEnter);
          node.removeEventListener("mouseleave", onLeave);
        });

        hoverTargetsRef.current.push(node);
      });
    };

    // initialise
    addHoverListeners();

    // observe DOM changes to attach to dynamically added targets
    const observer = new MutationObserver((mutations) => {
      // small optimization: if mutation contains added nodes, scan them
      mutations.forEach((m) => {
        if (m.addedNodes && m.addedNodes.length > 0) {
          addHoverListeners(m.addedNodes[0].parentNode || document);
        }
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    mutateObserverRef.current = observer;

    // listeners
    window.addEventListener("mousemove", onMove, { passive: true });

    // touch devices: optionally hide follower (we keep it visible only on pointer fine devices)
    const handlePointerChange = (ev: PointerEvent) => {
      // hide follower on touch input (coarse pointers)
      if (el) {
        if ((ev as PointerEvent).pointerType === "touch") {
          gsap.to(el, { autoAlpha: 0, duration: 0.2 });
        } else {
          gsap.to(el, { autoAlpha: 1, duration: 0.2 });
        }
      }
    };
    window.addEventListener("pointerdown", handlePointerChange);

    // cleanup on unmount
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("pointerdown", handlePointerChange);
      removeListenersRef.current.forEach((fn) => fn());
      observer.disconnect();
    };
  }, []);

  return (
    <motion.div
      ref={elRef}
      // we set transform translate to center the circle on the x/y we animate with gsap
      // tailwind utilities only (no plain css)
      className="
        fixed top-0 left-0
        -translate-x-1/2 -translate-y-1/2
        w-3 h-3 md:w-3 md:h-3 lg:w-4 lg:h-4
        rounded-full
        pointer-events-none
        z-[9999]
        shadow-[0_10px_30px_rgba(59,130,246,0.18)]
        mix-blend-normal
        backdrop-blur-none
      "
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.45, type: "spring", stiffness: 220, damping: 20 }}
      aria-hidden
    />
  );
}
