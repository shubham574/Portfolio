import { useEffect, useRef } from "react";

// ---- Minimal types + marquee timeline ----
type TimelineLike = {
  pause: () => void;
  play: () => void;
  kill: () => void;
  progress: (value?: number) => number;
  timeScale: (value?: number) => number;
};

type GsapContextCleanup = () => void;
type GsapContext = { revert: () => void };

// Lightweight mock timeline driving a continuous loop via rAF
const gsap = {
  registerPlugin: (..._plugins: unknown[]) => {},
  context: (fn: () => GsapContextCleanup | void, _element?: Element | null): GsapContext => {
    const cleanup = fn();
    return { revert: () => { if (typeof cleanup === "function") cleanup(); } };
  },
  timeline: (_cfg?: { repeat?: number; defaults?: Record<string, unknown> }): TimelineLike => {
    let rafId: number | null = null;
    let running = false;
    let t = 0;
    let duration = 1;
    let timescale = 1;
    let lastTs = 0;
    let onUpdate: ((progress: number) => void) | null = null;

    const loop = (ts: number) => {
      if (!running) return;
      if (!lastTs) lastTs = ts;
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;
      t += dt * timescale;
      if (t >= duration) t = t % duration;
      if (t < 0) t = (t % duration + duration) % duration;
      onUpdate?.(t / duration);
      rafId = requestAnimationFrame(loop);
    };

    const api: TimelineLike = {
      pause: () => {
        running = false;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
        lastTs = 0;
      },
      play: () => {
        if (!running) {
          running = true;
          rafId = requestAnimationFrame(loop);
        }
      },
      kill: () => {
        running = false;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
        lastTs = 0;
        onUpdate = null;
      },
      progress: (value?: number) => {
        if (typeof value === "number") t = value * duration;
        return t / duration;
      },
      timeScale: (value?: number) => {
        if (typeof value === "number") timescale = value;
        return timescale;
      },
    };

    // internal hook to set duration and update callback
    (api as any)._set = (d: number, cb: (p: number) => void) => {
      duration = Math.max(0.0001, d);
      onUpdate = cb;
    };

    return api;
  },
};

gsap.registerPlugin();

interface TestimonialCardProps {
  testimonial: string;
  author: string;
  role: string;
  company?: string;
  avatar?: string;
  rating?: number;
}

const TestimonialCard = ({
  testimonial,
  author,
  role,
  company,
  avatar,
  rating = 5,
}: TestimonialCardProps) => {
  return (
    <div 
      className="bg-purple-200 rounded-3xl shadow-sm border border-gray-400 h-full flex flex-col items-center text-center
                 w-full max-w-sm sm:max-w-md lg:max-w-full" 
      style={{ padding: "1.25rem" }}
    >
      {/* Avatar with gradient border */}
      <div className="relative mb-4">
        <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold text-lg sm:text-xl">
          {avatar || author.charAt(0)}
        </div>
        {/* Small checkmark badge */}
        <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-purple-500 rounded-full flex items-center justify-center">
          <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* Testimonial text - responsive layout */}
      <blockquote className="text-gray-800 text-sm sm:text-base lg:text-lg leading-relaxed mb-4 sm:mb-6 flex-grow overflow-hidden px-2">
        <div className="line-clamp-6 sm:line-clamp-8 lg:line-clamp-9 text-justify">
          "{testimonial}"
        </div>
      </blockquote>

      {/* Author info - responsive spacing */}
      <div className="mt-auto">
        <div className="font-semibold text-gray-900 text-sm sm:text-base mb-1">{author}</div>
        <div className="text-xs sm:text-sm text-gray-500 mb-1">{role}</div>
        {company && <div className="text-xs sm:text-sm text-gray-400">{company}</div>}
      </div>
    </div>
  );
};

export default function TestimonialMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const testimonials = [
    {
      testimonial:
        "At sira, my digital marketing agency, we needed a better way to manage our projects clients, and teams in Notion. Before working with Shashank, our workspace was messy and not optimized for how we actually work. Shashank quickly understood our needs and built a clean, custom setup that made everything easier to use and manage. The process was smooth, collaborative, and efficient. Since the setup, our team is more organized, workflows are clearer, and Notion has become a tool we rely on daily. I highly recommend Shashank — he's fast, smart, and truly knows how to make Notion work for your business.",
      author: "Raif Hourani",
      role: "Freelancer & CEO",
      company: "TechStart Inc.",
      avatar: "RH",
      rating: 5,
    },
    {
      testimonial:
        "Hi, I am founder of TheLinkAl, providing Al Solution System to corporates. As a visionary start up, we thought to implement professional environment set up for our company, where we can have everything at one place with max automation feasibility. I came across Notion Al, however, to learn and implement by ourself was time consuming. Hence, we thought to create complete professional environment set up through expert, and we found the right man Shashank. He is technically sound, down to earth, very supportive. He has developed beautiful environment set up for our company in time, and also helped our team to train to use it effectively. I will recommend him strongly for similar needs, he will be part of family and create.",
      author: "Michael Chen",
      role: "Product Manager",
      company: "InnovateCorp",
      avatar: "MC",
      rating: 5,
    },
    {
      testimonial:
        "A few weeks back, I was searching for a Notion Expert to help me navigate my Notion pages. I knew that I needed a system to streamline my ever increasing work load. Then Shashank Pandey came along. And now, I feel that there is some order in this chaos.",
      author: "Emily Rodriguez",
      role: "Operations Director",
      company: "GrowthLabs",
      avatar: "ER",
      rating: 5,
    }
  ];

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    // Duplicate the set for seamless wrap
    const clone = track.cloneNode(true) as HTMLDivElement;
    clone.setAttribute("data-clone", "true");

    // Wrapper to move both original + clone together
    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.willChange = "transform";
    wrapper.style.alignItems = "center";
    wrapper.style.gap = getComputedStyle(track).gap || "0px";

    // Replace original track with wrapper and append tracks
    const parent = track.parentElement!;
    parent.replaceChild(wrapper, track);
    wrapper.appendChild(track);
    wrapper.appendChild(clone);

    const measureOneSet = () => track.scrollWidth;

    const tl = gsap.timeline({ repeat: -1 });
    
    // Responsive speed based on screen size
    const getSpeed = () => {
      const width = window.innerWidth;
      if (width < 640) return 60; // slower on mobile
      if (width < 1024) return 80; // medium on tablet
      return 120; // fastest on desktop
    };

    const setup = () => {
      const widthOneSet = measureOneSet();
      const speedPxPerSec = getSpeed();
      const duration = Math.max(0.5, widthOneSet / speedPxPerSec);
      (tl as any)._set(duration, (progress: number) => {
        const x = -progress * widthOneSet;
        wrapper.style.transform = `translate3d(${x}px, 0, 0)`;
      });
    };

    // Initialize and run
    setup();
    tl.play();

    // Maintain visual position on resize
    const onResize = () => {
      const prev = tl.progress();
      setup();
      tl.progress(prev);
    };

    // Pause on hover, resume on leave
    const onEnter = () => tl.pause();
    const onLeave = () => tl.play();

    window.addEventListener("resize", onResize, { passive: true });
    container.addEventListener("mouseenter", onEnter);
    container.addEventListener("mouseleave", onLeave);

    // Reduced motion handling
    const mql =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)");

    const applyMotionPref = () => {
      if (mql && mql.matches) tl.pause();
      else tl.play();
    };

    if (mql) {
      applyMotionPref();
      if (typeof mql.addEventListener === "function") {
        mql.addEventListener("change", applyMotionPref);
      } else if (typeof mql.addListener === "function") {
        mql.addListener(applyMotionPref);
      }
    }

    return () => {
      if (mql) {
        if (typeof mql.removeEventListener === "function") {
          mql.removeEventListener("change", applyMotionPref);
        } else if (typeof mql.removeListener === "function") {
          mql.removeListener(applyMotionPref);
        }
      }
      window.removeEventListener("resize", onResize);
      container.removeEventListener("mouseenter", onEnter);
      container.removeEventListener("mouseleave", onLeave);
      tl.kill();
      // DOM cleanup: unwrap and remove clone
      parent.replaceChild(track, wrapper);
      if (clone.parentElement) clone.parentElement.removeChild(clone);
    };
  }, []);

  return (
    <main className="w-full sm:h-[35vh]  lg:h-[60vh] bg-white pt-6 sm:pt-8 lg:pt-12 pb-4 " style={{paddingTop:20}}>
      <div
        ref={containerRef}
        className="overflow-hidden py-4 sm:py-6"
        style={{ cursor: "pointer" }}
      >
        <div 
          ref={trackRef} 
          className="flex items-center 
                     gap-4 sm:gap-6 lg:gap-8 
                     pl-4 sm:pl-6"
        >
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="
                min-w-[280px] h-[300px]        /* Mobile: 1 card fits ~320px viewport */
                sm:min-w-[300px] sm:h-[350px]  /* Tablet: 2 cards fit ~768px viewport */
                lg:min-w-[800px] lg:h-[400px]  /* Desktop: 3 cards as original */
                flex items-center justify-center
              "
            >
              <TestimonialCard {...t} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
