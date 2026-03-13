"use client"

import { motion, type HTMLMotionProps, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { haptic, type HapticPattern } from "@/lib/haptics"
import React from "react"

/* ── FadeIn ─── */
export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.5,
  ...props
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
} & Omit<HTMLMotionProps<"div">, "children">) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

/* ── StaggerChildren ─── */
export function StaggerChildren({
  children,
  className,
  staggerDelay = 0.08,
}: {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ── StaggerItem ─── */
export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20, scale: 0.97 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ── SlideUp: element floats in from below on scroll ─── */
export function SlideUp({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ── ScaleOnTap: juicy button "pop" + haptic feedback ─── */
export function ScaleOnTap({
  children,
  className,
  hapticPattern = "light",
  ...props
}: {
  children: React.ReactNode
  className?: string
  hapticPattern?: HapticPattern
} & Omit<HTMLMotionProps<"div">, "children">) {
  return (
    <motion.div
      whileTap={{ scale: 0.93 }}
      whileHover={{ scale: 1.03, y: -2 }}
      transition={{ type: "spring", stiffness: 500, damping: 15 }}
      className={cn("inline-flex", className)}
      onTapStart={() => haptic(hapticPattern)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

/* ── FloatIn: gentle floating entrance ─── */
export function FloatIn({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ── FloatingParticles: ambient floating dots background ─── */
export function FloatingParticles({
  count = 20,
  className,
  colors = ["var(--matcha)", "var(--sky)", "var(--caramel)", "var(--chart-4)"],
}: {
  count?: number
  className?: string
  colors?: string[]
}) {
  const [particles, setParticles] = React.useState<
    { id: number; x: number; y: number; size: number; duration: number; delay: number; color: string; opacity: number }[]
  >([])

  React.useEffect(() => {
    setParticles(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 6 + 3,
        duration: Math.random() * 8 + 6,
        delay: Math.random() * 4,
        color: colors[i % colors.length],
        opacity: Math.random() * 0.3 + 0.1,
      }))
    )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count])

  if (particles.length === 0) return null

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -30, 10, -20, 0],
            x: [0, 15, -10, 20, 0],
            scale: [1, 1.3, 0.8, 1.1, 1],
            opacity: [p.opacity, p.opacity * 1.5, p.opacity * 0.5, p.opacity * 1.2, p.opacity],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

/* ── PulseGlow: pulsing glow ring behind an element ─── */
export function PulseGlow({
  children,
  className,
  color = "var(--matcha)",
}: {
  children: React.ReactNode
  className?: string
  color?: string
}) {
  return (
    <div className={cn("relative inline-flex", className)}>
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: color, filter: "blur(20px)" }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

/* ── ConfettiBurst: fire-and-forget confetti on mount ─── */
export function ConfettiBurst({
  active = true,
  count = 24,
  className,
}: {
  active?: boolean
  count?: number
  className?: string
}) {
  const [pieces, setPieces] = React.useState<
    { id: number; angle: number; distance: number; rotation: number; color: string; size: number; isCircle: boolean }[]
  >([])

  React.useEffect(() => {
    setPieces(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        angle: (360 / count) * i + Math.random() * 15,
        distance: 40 + Math.random() * 60,
        rotation: Math.random() * 720 - 360,
        color: ["var(--matcha)", "var(--sky)", "var(--caramel)", "var(--chart-4)"][i % 4],
        size: Math.random() * 6 + 4,
        isCircle: Math.random() > 0.5,
      }))
    )
  }, [count])

  return (
    <AnimatePresence>
      {active && pieces.length > 0 && (
        <div className={cn("pointer-events-none absolute inset-0 flex items-center justify-center", className)}>
          {pieces.map((p) => {
            const rad = (p.angle * Math.PI) / 180
            const tx = Math.cos(rad) * p.distance
            const ty = Math.sin(rad) * p.distance
            return (
              <motion.div
                key={p.id}
                className={p.isCircle ? "absolute rounded-full" : "absolute rounded-sm"}
                style={{
                  width: p.size,
                  height: p.isCircle ? p.size : p.size * 0.5,
                  backgroundColor: p.color,
                }}
                initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
                animate={{
                  x: tx,
                  y: ty,
                  scale: [0, 1.2, 1],
                  opacity: [1, 1, 0],
                  rotate: p.rotation,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            )
          })}
        </div>
      )}
    </AnimatePresence>
  )
}

/* ── WavyText: each letter animates in with a wave ─── */
export function WavyText({
  text,
  className,
  delay = 0,
}: {
  text: string
  className?: string
  delay?: number
}) {
  return (
    <span className={cn("inline-flex", className)}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: delay + i * 0.03,
            duration: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  )
}

/* ── MorphBlob: organic morphing background blob ─── */
export function MorphBlob({
  className,
  color = "var(--matcha)",
}: {
  className?: string
  color?: string
}) {
  return (
    <motion.div
      className={cn("absolute rounded-full opacity-20 blur-3xl", className)}
      style={{ backgroundColor: color }}
      animate={{
        borderRadius: [
          "40% 60% 70% 30% / 40% 50% 60% 50%",
          "70% 30% 50% 50% / 30% 30% 70% 70%",
          "50% 60% 30% 60% / 60% 40% 60% 40%",
          "40% 60% 70% 30% / 40% 50% 60% 50%",
        ],
        scale: [1, 1.08, 0.95, 1],
      }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
    />
  )
}

/* ── AnimatedCounter ─── */
export function AnimatedCounter({
  target,
  duration = 2,
  suffix = "",
  prefix = "",
  className,
}: {
  target: number
  duration?: number
  suffix?: string
  prefix?: string
  className?: string
}) {
  const [count, setCount] = React.useState(0)
  const [hasAnimated, setHasAnimated] = React.useState(false)
  const ref = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    if (hasAnimated) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true)
          const startTime = Date.now()
          const animate = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / (duration * 1000), 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * target))
            if (progress < 1) requestAnimationFrame(animate)
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration, hasAnimated])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

/* ── Shimmer: subtle shimmer across an element ─── */
export function Shimmer({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {children}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
        }}
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
      />
    </div>
  )
}
