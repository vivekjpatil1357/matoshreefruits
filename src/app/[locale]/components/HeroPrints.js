"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const HOLD_MS = 5600; // hold each print, then crossfade (1.6s CSS transition)
const FADE = "opacity-0";

/**
 * The hero's principal photograph: newest lot prints crossfade like light
 * shifting in a room. Without JS the first print simply stays; with reduced
 * motion the rotation stops. Pauses while the tab is hidden.
 *
 * @param {Array<{src: string, alt: string}>} images
 */
export default function HeroPrints({ images }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (images.length < 2) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }
    let timer;
    function tick() {
      timer = setTimeout(() => {
        if (!document.hidden) setIdx((i) => (i + 1) % images.length);
        tick();
      }, HOLD_MS);
    }
    tick();
    return () => clearTimeout(timer);
  }, [images.length]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {images.map((im, i) => (
        <Image
          key={im.src}
          src={im.src}
          alt={im.alt}
          fill
          priority={i === 0}
          loading="eager"
          sizes="(max-width: 1024px) 78vw, 33vw"
          className={`object-cover transition-opacity duration-[1600ms] ease-[cubic-bezier(0.32,0.72,0,1)] ${
            i === idx ? "opacity-100" : FADE
          }`}
        />
      ))}
    </div>
  );
}
