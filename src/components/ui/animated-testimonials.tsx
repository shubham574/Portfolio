'use client';
import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Utility function for class merging
const cn = (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' ');

// Testimonial type definition
interface Testimonial {
  quote: string;
  name: string;
  designation: string;
  src: string;
}

interface AnimatedTestimonialsProps {
  testimonials: Testimonial[];
  autoplay?: boolean;
}

export const AnimatedTestimonials: React.FC<AnimatedTestimonialsProps> = ({
  testimonials,
  autoplay = false,
}) => {
  const [active, setActive] = useState(0);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const isActive = (index: number) => {
    return index === active;
  };

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay]);

  const randomRotateY = () => {
    return Math.floor(Math.random() * 21) - 10;
  };

  return (
    <div className="mx-auto max-w-sm px-4 py-20 font-sans antialiased md:max-w-4xl md:px-8 lg:px-12">
      <div className="relative grid grid-cols-1 gap-20 md:grid-cols-2">
        <div>
          <div className="relative h-80 w-full">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.src}
                className={cn(
                  "absolute inset-0 origin-bottom transition-all duration-400 ease-in-out transform",
                  isActive(index)
                    ? "opacity-100 scale-100 z-40 rotate-0"
                    : "opacity-70 scale-95 z-10"
                )}
                style={{
                  zIndex: isActive(index) ? 40 : testimonials.length + 2 - index,
                  transform: isActive(index) 
                    ? 'translateY(0) rotate(0deg) scale(1)' 
                    : `translateY(0) rotate(${randomRotateY()}deg) scale(0.95)`
                }}
              >
                <img
                  src={testimonial.src}
                  alt={testimonial.name}
                  width={500}
                  height={500}
                  draggable={false}
                  className="h-full w-full rounded-3xl object-cover object-center"
                />
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col justify-between py-4">
          <div
            key={active}
            className="transform transition-all duration-200 ease-in-out"
          >
            <h3 className="text-2xl font-bold text-black dark:text-white">
              {testimonials[active].name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-neutral-500">
              {testimonials[active].designation}
            </p>
            <p className="mt-8 text-lg text-gray-500 dark:text-neutral-300">
              {testimonials[active].quote.split(" ").map((word, index) => (
                <span
                  key={index}
                  className="inline-block transition-all duration-200 ease-in-out"
                  style={{
                    animationDelay: `${0.02 * index}s`,
                    filter: 'blur(0px)',
                    opacity: 1,
                    transform: 'translateY(0)'
                  }}
                >
                  {word}{" "}
                </span>
              ))}
            </p>
          </div>
          
          <div className="flex gap-4 pt-12 md:pt-0">
            <button
              onClick={handlePrev}
              className="group/button flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-black transition-transform duration-300 group-hover/button:rotate-12 dark:text-neutral-400" />
            </button>
            <button
              onClick={handleNext}
              className="group/button flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-black transition-transform duration-300 group-hover/button:-rotate-12 dark:text-neutral-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};