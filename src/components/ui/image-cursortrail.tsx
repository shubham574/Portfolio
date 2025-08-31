"use client"

import { createRef, useRef, ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ImageItem {
  id: string
  src: string
  alt?: string
}

interface ImageMouseTrailProps {
  items: (ImageItem | string)[]
  children?: ReactNode
  className?: string
  imgClass?: string
  distance?: number
  maxNumberOfImages?: number
  fadeAnimation?: boolean
}

export default function ImageCursorTrail({
  items,
  children,
  className,
  maxNumberOfImages = 5,
  imgClass = "w-40 h-48",
  distance = 20,
  fadeAnimation = true,
}: ImageMouseTrailProps) {
  // normalize items (support string[] or object[])
  const normalizedItems: ImageItem[] = items.map((item, i) =>
    typeof item === "string"
      ? { id: String(i), src: item, alt: `image-${i}` }
      : item
  )

  const containerRef = useRef<HTMLDivElement | null>(null)
  const refs = useRef(normalizedItems.map(() => createRef<HTMLImageElement>()))
  const currentZIndexRef = useRef(1)

  let globalIndex = 0
  let last = { x: 0, y: 0 }

  const activate = (image: HTMLImageElement, x: number, y: number) => {
    const containerRect = containerRef.current?.getBoundingClientRect()
    if (!containerRect) return

    const relativeX = x - containerRect.left
    const relativeY = y - containerRect.top

    image.style.left = `${relativeX}px`
    image.style.top = `${relativeY}px`

    if (currentZIndexRef.current > 40) currentZIndexRef.current = 1
    image.style.zIndex = String(currentZIndexRef.current++)
    image.dataset.status = "active"

    if (fadeAnimation) {
      setTimeout(() => {
        image.dataset.status = "inactive"
      }, 1500)
    }

    last = { x, y }
  }

  const distanceFromLast = (x: number, y: number) =>
    Math.hypot(x - last.x, y - last.y)

  const deactivate = (image: HTMLImageElement) => {
    image.dataset.status = "inactive"
  }

  const handleOnMove = (e: React.MouseEvent | React.TouchEvent) => {
    let clientX: number
    let clientY: number

    if ("touches" in e) {
      if (e.touches.length === 0) return
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    if (distanceFromLast(clientX, clientY) > window.innerWidth / distance) {
      const lead = refs.current[globalIndex % refs.current.length].current
      const tail =
        refs.current[(globalIndex - maxNumberOfImages) % refs.current.length]
          ?.current

      if (lead) activate(lead, clientX, clientY)
      if (tail) deactivate(tail)

      globalIndex++
    }
  }

  return (
    <section
      ref={containerRef}
      onMouseMove={handleOnMove}
      onTouchMove={handleOnMove}
      className={cn(
        "relative grid h-[600px] w-full place-content-center overflow-hidden rounded-lg",
        className
      )}
    >
      {normalizedItems.map((item, index) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={item.id}
          ref={refs.current[index]}
          src={item.src}
          alt={item.alt ?? `image-${index}`}
          data-index={index}
          data-status="inactive"
          className={cn(
            "opacity:0 data-[status='active']:ease-out-expo absolute -translate-x-1/2 -translate-y-1/2 scale-0 rounded-3xl object-cover transition-transform duration-300 data-[status='active']:scale-100 data-[status='active']:opacity-100 data-[status='active']:duration-500",
            imgClass
          )}
        />
      ))}
      {children}
    </section>
  )
}
