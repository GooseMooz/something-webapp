"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ScaleOnTap } from "@/components/motion-wrapper"
import type { LucideIcon } from "lucide-react"

export function StatCard({
  icon: Icon,
  label,
  value,
  accent = "matcha",
}: {
  icon: LucideIcon
  label: string
  value: string | number
  accent?: "matcha" | "sky" | "caramel"
}) {
  const accentMap = {
    matcha: "bg-matcha/15 text-matcha-dark",
    sky: "bg-sky/15 text-sky-dark",
    caramel: "bg-caramel/15 text-espresso",
  }

  return (
    <ScaleOnTap className="w-full">
      <Card className="border-border/60 bg-card">
        <CardContent className="flex items-center gap-3 p-4">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 ${accentMap[accent]}`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-extrabold leading-none text-espresso">
              {value}
            </p>
            <p className="text-xs font-medium text-espresso/50 mt-0.5">{label}</p>
          </div>
        </CardContent>
      </Card>
    </ScaleOnTap>
  )
}
