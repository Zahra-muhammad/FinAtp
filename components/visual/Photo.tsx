"use client";

// Photography in the brand's ink/blue duotone (SVG filter defined once in
// DuotoneDefs), with film grain and optional scroll parallax.

import Image from "next/image";
import { motion } from "framer-motion";
import { useParallax } from "@/components/motion/primitives";
import type { Photo as PhotoData } from "@/data/images";

export function Photo({
  photo,
  className = "",
  sizes = "100vw",
  priority = false,
  parallax = 0,
  tone = "ink",
  overlay = false,
}: {
  photo: PhotoData;
  className?: string;
  sizes?: string;
  priority?: boolean;
  parallax?: number;
  tone?: "ink" | "light";
  overlay?: boolean;
}) {
  const { ref, y } = useParallax(parallax);
  return (
    <div ref={ref} className={`grain overflow-hidden bg-ink ${/\b(absolute|fixed)\b/.test(className) ? "" : "relative"} ${className}`}>
      <motion.div className="absolute inset-0" style={parallax ? { y, scale: 1 + parallax / 50 } : undefined}>
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes={sizes}
          quality={60}
          // Next 16 deprecates `priority`; eager + high fetch priority for hero images.
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          className="object-cover"
          style={{ filter: `url(#duotone-${tone})` }}
        />
      </motion.div>
      {overlay ? <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" /> : null}
    </div>
  );
}

// Rendered once in the root layout.
export function DuotoneDefs() {
  return (
    <svg aria-hidden width="0" height="0" className="absolute" focusable="false">
      <defs>
        {/* ink #0C0F14 → gulf mid → paper #F2EFE8 */}
        <filter id="duotone-ink" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0 0 0 1 0" />
          <feComponentTransfer>
            <feFuncR type="table" tableValues="0.047 0.13 0.42 0.95" />
            <feFuncG type="table" tableValues="0.059 0.17 0.47 0.94" />
            <feFuncB type="table" tableValues="0.078 0.36 0.66 0.91" />
          </feComponentTransfer>
        </filter>
        {/* lighter variant for paper sections */}
        <filter id="duotone-light" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0 0 0 1 0" />
          <feComponentTransfer>
            <feFuncR type="table" tableValues="0.11 0.36 0.78 0.95" />
            <feFuncG type="table" tableValues="0.16 0.42 0.8 0.94" />
            <feFuncB type="table" tableValues="0.33 0.62 0.86 0.91" />
          </feComponentTransfer>
        </filter>
      </defs>
    </svg>
  );
}
