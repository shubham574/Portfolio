"use client"

import { useGSAP } from "@gsap/react";
import gsap from "gsap"
import CustomEase from "gsap/CustomEase"
import { useState } from "react"

gsap.registerPlugin(CustomEase)
CustomEase.create("hop", "0.9, 0, 0.1, 1")

export function useRevealer(): boolean {
  const [done, setDone] = useState(false)

  useGSAP(() => {
    gsap.to(".revealer", {
      scaleY: 0,
      duration: 1.25,
      delay: 1,
      ease: "hop",
      onComplete: () => setDone(true), // ✅ mark finished
    })
  }, [])

  return done
}
