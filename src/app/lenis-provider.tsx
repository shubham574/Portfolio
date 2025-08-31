"use client";

import { useEffect } from "react";
import Lenis, { LenisOptions } from "@studio-freight/lenis";

export default function LenisProvider() {
  useEffect(() => {
    const options: LenisOptions = {
      duration: 1.2, // 0.8–1.5 is a good range
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,      // keep wheel smoothing
      wheelMultiplier: 1,     // intensity for wheel
      touchMultiplier: 1.2,   // intensity for touch/trackpad
      // orientation: "vertical",  // or "horizontal"
      // gestureOrientation: "vertical",
      // infinite: false,
    };

    const lenis = new Lenis(options);

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    const onHash = () => {
      const id = window.location.hash.slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (el) lenis.scrollTo(el, { offset: 0, duration: 1 });
    };
    window.addEventListener("hashchange", onHash);
    onHash();

    return () => {
      window.removeEventListener("hashchange", onHash);
      lenis.destroy();
    };
  }, []);

  return null;
}
