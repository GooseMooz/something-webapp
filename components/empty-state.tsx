"use client"

import { Search } from "lucide-react"
import { motion } from "framer-motion"

export function EmptyState({
  title = "Nothing here yet",
  description = "Try adjusting your filters or check back later.",
}: {
  title?: string
  description?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      {/* Animated illustration with orbiting dots */}
      <div className="relative mb-8">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-28 w-28 items-center justify-center rounded-3xl bg-matcha/10"
        >
          <Search className="h-12 w-12 text-matcha-dark/50" />
        </motion.div>

        {/* Orbiting particles */}
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: "50%", top: "50%" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 6 + i * 2, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
          >
            <motion.div
              className="rounded-full"
              style={{
                width: 6 + i * 2,
                height: 6 + i * 2,
                backgroundColor: ["var(--matcha)", "var(--sky)", "var(--caramel)", "var(--chart-4)"][i],
                opacity: 0.4,
                transform: `translateX(${50 + i * 12}px) translateY(-50%)`,
              }}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            />
          </motion.div>
        ))}

        {/* Floating decorative shapes */}
        <motion.div
          animate={{ y: [0, -8, 0], x: [0, 5, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          className="absolute -right-4 -top-4 h-5 w-5 rounded-lg bg-sky/25 rotate-12"
        />
        <motion.div
          animate={{ y: [0, 8, 0], x: [0, -4, 0], rotate: [0, -15, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          className="absolute -bottom-3 -left-5 h-4 w-4 rounded-full bg-matcha/25"
        />
        <motion.div
          animate={{ y: [0, -5, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
          className="absolute -bottom-1 right-[-20px] h-3 w-6 rounded-full bg-chart-4/25 rotate-45"
        />
      </div>

      <h3 className="text-xl font-bold text-espresso text-balance">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-espresso/45 leading-relaxed text-pretty">
        {description}
      </p>
    </motion.div>
  )
}
