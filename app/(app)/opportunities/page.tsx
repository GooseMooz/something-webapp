"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  Search,
  SlidersHorizontal,
  X,
  Check,
  MapPin,
  Clock,
  Users,
  Zap,
  Star,
  ArrowRight,
  TrendingUp,
  Leaf,
  BookOpen,
  Handshake,
  Palette,
  Heart,
  Laptop,
  Dumbbell,
  Grid3X3,
  ChevronDown,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer"
import { EmptyState } from "@/components/empty-state"
import {
  FadeIn,
  SlideUp,
  StaggerChildren,
  StaggerItem,
  ScaleOnTap,
} from "@/components/motion-wrapper"
import { mockOpportunities, categories } from "@/lib/mock-data"
import type { Opportunity } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { haptic } from "@/lib/haptics"

/* ── Decorative helpers ─────────────────────────────────── */
function Asterisk({ size = 20, color = "currentColor", className = "" }: { size?: number; color?: string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      {[0, 45, 90, 135].map((angle) => (
        <line key={angle} x1="12" y1="2" x2="12" y2="22" stroke={color} strokeWidth="2.2" strokeLinecap="round"
          transform={`rotate(${angle} 12 12)`} />
      ))}
    </svg>
  )
}

const timeOptions = ["Any", "1-2 hours", "3-4 hours", "5+ hours", "Ongoing"]

const categoryIconMap: Record<string, React.ElementType> = {
  All: Grid3X3,
  Environment: Leaf,
  Education: BookOpen,
  Community: Handshake,
  "Arts & Culture": Palette,
  Health: Heart,
  Technology: Laptop,
  Sports: Dumbbell,
}

const categoryColorMap: Record<string, { bg: string; text: string; border: string; accent: string }> = {
  Environment: { bg: "bg-matcha/10", text: "text-matcha-dark", border: "border-matcha/25", accent: "bg-matcha" },
  Education: { bg: "bg-sky/10", text: "text-sky-dark", border: "border-sky/25", accent: "bg-sky" },
  Community: { bg: "bg-caramel/10", text: "text-espresso/80", border: "border-caramel/25", accent: "bg-caramel" },
  "Arts & Culture": { bg: "bg-honey/10", text: "text-espresso/80", border: "border-honey/25", accent: "bg-honey" },
  Health: { bg: "bg-rose/10", text: "text-rose", border: "border-rose/25", accent: "bg-rose" },
  Technology: { bg: "bg-sky/10", text: "text-sky-dark", border: "border-sky/25", accent: "bg-sky" },
  Sports: { bg: "bg-caramel/10", text: "text-espresso/80", border: "border-caramel/25", accent: "bg-caramel" },
}

const cardClass = "border-border/60 bg-card shadow-sm shadow-espresso/[0.03]"

export default function OpportunitiesPage() {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedTime, setSelectedTime] = useState("Any")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const filtered = useMemo(() => {
    return mockOpportunities.filter((op) => {
      const matchesSearch =
        !search ||
        op.title.toLowerCase().includes(search.toLowerCase()) ||
        op.organization.toLowerCase().includes(search.toLowerCase()) ||
        op.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))

      const matchesCategory =
        selectedCategory === "All" || op.category === selectedCategory

      const matchesTime =
        selectedTime === "Any" ||
        (selectedTime === "1-2 hours" && op.timeCommitment.includes("2 hour")) ||
        (selectedTime === "3-4 hours" &&
          (op.timeCommitment.includes("3 hour") || op.timeCommitment.includes("4 hour"))) ||
        (selectedTime === "5+ hours" &&
          (op.timeCommitment.includes("5 hour") || op.timeCommitment.includes("6 hour"))) ||
        (selectedTime === "Ongoing" && op.timeCommitment.includes("week"))

      return matchesSearch && matchesCategory && matchesTime
    })
  }, [search, selectedCategory, selectedTime])

  const urgentCount = mockOpportunities.filter((op) => op.urgent).length
  const activeFilters = (selectedCategory !== "All" ? 1 : 0) + (selectedTime !== "Any" ? 1 : 0)

  function clearFilters() {
    setSelectedCategory("All")
    setSelectedTime("Any")
    setSearch("")
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 pb-24 md:px-6 md:py-8 md:pb-8">
      {/* Page Header */}
      <FadeIn>
        <div className="flex flex-col gap-1 mb-5 relative">
          {/* Decorative accents */}
          <motion.div className="absolute -top-1 right-4 hidden sm:block"
            initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 280 }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}>
              <Asterisk size={24} color="var(--matcha)" />
            </motion.div>
          </motion.div>
          <motion.div className="absolute top-2 right-14 hidden sm:block"
            initial={{ scale: 0 }} animate={{ scale: 1, y: [0, -5, 0] }}
            transition={{ delay: 0.7, y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" } }}>
            <Asterisk size={14} color="var(--honey)" />
          </motion.div>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-extrabold text-espresso md:text-3xl">
              Opportunities
            </h1>
            <div className="flex items-center gap-2">
              {urgentCount > 0 && (
                <Badge className="rounded-full border-none bg-destructive/10 text-destructive px-2.5 py-1 text-xs font-bold">
                  <Zap className="mr-1 h-3 w-3" />
                  {urgentCount} urgent
                </Badge>
              )}
            </div>
          </div>
          <p className="text-sm text-espresso/40">
            {mockOpportunities.length} opportunities across Metro Vancouver
          </p>
        </div>
      </FadeIn>

      {/* Search bar */}
      <FadeIn delay={0.04}>
        <div className="flex items-center gap-2 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-espresso/25" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search opportunities, orgs, tags..."
              className="h-11 rounded-full border-border/60 bg-card pl-11 pr-10 text-sm shadow-sm shadow-espresso/[0.02]"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-espresso/25 hover:text-espresso"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Desktop sidebar toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex items-center gap-1.5 rounded-full border-border/60 text-xs font-semibold text-espresso/50 hover:text-espresso h-11 px-4"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters
            {activeFilters > 0 && (
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-matcha text-[10px] font-bold text-espresso">
                {activeFilters}
              </span>
            )}
          </Button>

          {/* Mobile filter drawer trigger */}
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="relative h-11 w-11 shrink-0 rounded-full border-border/60 lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4 text-espresso" />
                {activeFilters > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-matcha text-[10px] font-bold text-espresso"
                  >
                    {activeFilters}
                  </motion.span>
                )}
                <span className="sr-only">Filters</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle className="text-lg font-extrabold text-espresso">Filters</DrawerTitle>
              </DrawerHeader>
              <div className="flex flex-col gap-6 px-4 pb-4">
                <FilterSection
                  title="Category"
                  options={categories}
                  selected={selectedCategory}
                  onSelect={setSelectedCategory}
                  iconMap={categoryIconMap}
                />
                <FilterSection
                  title="Time Commitment"
                  options={timeOptions}
                  selected={selectedTime}
                  onSelect={setSelectedTime}
                />
              </div>
              <DrawerFooter>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={clearFilters} className="flex-1 rounded-full border-border font-semibold text-espresso">
                    Clear All
                  </Button>
                  <DrawerClose asChild>
                    <Button className="flex-1 rounded-full bg-espresso font-bold text-card hover:bg-espresso/90">
                      {"Show "}{filtered.length}{" Results"}
                    </Button>
                  </DrawerClose>
                </div>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </FadeIn>

      {/* Mobile active filter pills */}
      <AnimatePresence>
        {activeFilters > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex gap-1.5 mb-4 lg:hidden"
          >
            {selectedCategory !== "All" && (
              <Badge className="rounded-full border-none bg-espresso/10 text-espresso text-xs font-semibold">
                {selectedCategory}
                <button onClick={() => setSelectedCategory("All")} className="ml-1" aria-label={`Remove ${selectedCategory} filter`}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedTime !== "Any" && (
              <Badge className="rounded-full border-none bg-espresso/10 text-espresso text-xs font-semibold">
                {selectedTime}
                <button onClick={() => setSelectedTime("Any")} className="ml-1" aria-label={`Remove ${selectedTime} filter`}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content: sidebar + grid */}
      <div className="flex gap-6">
        {/* Desktop sidebar filters */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 240, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="hidden lg:block shrink-0 overflow-hidden"
            >
              <div className="w-60">
                <Card className={cn(cardClass, "sticky top-24")}>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-espresso">Filters</h3>
                      {activeFilters > 0 && (
                        <button onClick={clearFilters} className="text-[11px] font-semibold text-matcha-dark hover:text-espresso transition-colors">
                          Clear all
                        </button>
                      )}
                    </div>

                    {/* Category */}
                    <div className="mb-5">
                      <h4 className="text-xs font-bold text-espresso/40 uppercase tracking-wider mb-3">Category</h4>
                      <div className="flex flex-col gap-1">
                        {categories.map((cat) => {
                          const Icon = categoryIconMap[cat] ?? Grid3X3
                          const isActive = selectedCategory === cat
                          const catColors = categoryColorMap[cat]
                          return (
                            <button
                              key={cat}
                              onClick={() => { setSelectedCategory(cat); haptic("selection") }}
                              className={cn(
                                "flex items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-medium transition-all",
                                isActive && catColors
                                  ? cn(catColors.bg, catColors.text, "ring-1", catColors.border)
                                  : isActive
                                  ? "bg-espresso text-card"
                                  : "text-espresso/50 hover:bg-latte/60 hover:text-espresso"
                              )}
                            >
                              <Icon className="h-3.5 w-3.5 shrink-0" />
                              <span className="flex-1">{cat}</span>
                              {isActive && <Check className="h-3.5 w-3.5 shrink-0" />}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Time Commitment */}
                    <div>
                      <h4 className="text-xs font-bold text-espresso/40 uppercase tracking-wider mb-3">Time</h4>
                      <div className="flex flex-col gap-1">
                        {timeOptions.map((opt) => {
                          const isActive = selectedTime === opt
                          return (
                            <button
                              key={opt}
                              onClick={() => { setSelectedTime(opt); haptic("selection") }}
                              className={cn(
                                "flex items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-medium transition-all",
                                isActive
                                  ? "bg-espresso text-card"
                                  : "text-espresso/50 hover:bg-latte/60 hover:text-espresso"
                              )}
                            >
                              <Clock className="h-3.5 w-3.5 shrink-0" />
                              <span className="flex-1">{opt}</span>
                              {isActive && <Check className="h-3.5 w-3.5 shrink-0" />}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Card Grid */}
        <div className="flex-1 min-w-0">
          {/* Results count */}
          <SlideUp>
            <p className="mb-4 text-xs font-semibold text-espresso/30 uppercase tracking-wider">
              {filtered.length} {filtered.length === 1 ? "result" : "results"}
            </p>
          </SlideUp>

          <AnimatePresence mode="wait">
            {filtered.length > 0 ? (
              <StaggerChildren key="results" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((op) => (
                  <StaggerItem key={op.id}>
                    <OpportunityCard opportunity={op} />
                  </StaggerItem>
                ))}
              </StaggerChildren>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <EmptyState
                  title="No opportunities match your vibe right now"
                  description="Try tweaking your filters or search for something different. New opportunities drop every day!"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

/* -- Filter Section (for mobile drawer) -- */
function FilterSection({
  title,
  options,
  selected,
  onSelect,
  iconMap,
}: {
  title: string
  options: string[]
  selected: string
  onSelect: (v: string) => void
  iconMap?: Record<string, React.ElementType>
}) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-bold text-espresso">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isActive = selected === opt
          const Icon = iconMap?.[opt]
          return (
            <button
              key={opt}
              onClick={() => onSelect(opt)}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-semibold transition-all",
                isActive
                  ? "border-espresso/20 bg-espresso text-card"
                  : "border-border text-espresso/50 hover:border-espresso/20"
              )}
            >
              {isActive && <Check className="h-3.5 w-3.5" />}
              {Icon && !isActive && <Icon className="h-3.5 w-3.5" />}
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* -- Opportunity Card -- */
function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const spotsPercent = ((opportunity.totalSpots - opportunity.spotsLeft) / opportunity.totalSpots) * 100
  const colors = categoryColorMap[opportunity.category] ?? categoryColorMap.Community
  const isAlmostFull = opportunity.spotsLeft <= 5

  return (
    <Link href={`/opportunities/${opportunity.id}`}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="h-full"
      >
        <Card className={cn(cardClass, "group relative overflow-hidden h-full transition-all hover:shadow-md hover:shadow-espresso/[0.06] hover:border-border")}>
          {/* Category color top bar */}
          <div className={cn("h-1.5 w-full", colors.accent, "opacity-80")} />

          <CardContent className="flex h-full flex-col p-5">
            {/* Header: org + urgent */}
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold shrink-0", colors.bg, colors.text)}>
                  {opportunity.organization.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-espresso/55">{opportunity.organization}</p>
                  <p className="text-[10px] text-espresso/25">{opportunity.date}</p>
                </div>
              </div>
              {opportunity.urgent && (
                <Badge className="rounded-full border-none bg-destructive/10 text-destructive font-bold text-[10px] px-2 py-0.5 shrink-0 animate-pulse">
                  <Zap className="mr-0.5 h-2.5 w-2.5" />
                  Urgent
                </Badge>
              )}
            </div>

            {/* Title */}
            <h3 className="text-[15px] font-bold leading-snug text-espresso mb-2 text-balance">
              {opportunity.title}
            </h3>

            {/* Description */}
            <p className="text-xs text-espresso/40 leading-relaxed line-clamp-2 mb-3">
              {opportunity.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-3">
              <Badge className={cn("rounded-full border text-[10px] font-semibold px-2 py-0.5", colors.bg, colors.text, colors.border)}>
                {opportunity.category}
              </Badge>
              {opportunity.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="rounded-full text-[10px] font-medium text-espresso/40 border-border/50 px-2 py-0.5">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Meta row */}
            <div className="flex items-center gap-3 text-[11px] text-espresso/40 mb-4">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span className="truncate max-w-[100px]">{opportunity.location.split(",")[0]}</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {opportunity.timeCommitment}
              </span>
            </div>

            {/* Bottom: XP + spots + CTA */}
            <div className="mt-auto pt-3 border-t border-border/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-sm font-bold text-matcha-dark">
                    <Star className="h-3.5 w-3.5 fill-matcha text-matcha" />
                    {opportunity.xpReward} XP
                  </span>
                  <span className={cn(
                    "flex items-center gap-1 text-xs",
                    isAlmostFull ? "text-destructive font-bold" : "text-espresso/35"
                  )}>
                    <Users className="h-3 w-3" />
                    {opportunity.spotsLeft} left
                  </span>
                </div>
                <span className="text-xs font-semibold text-espresso/30 group-hover:text-espresso transition-colors flex items-center gap-0.5">
                  View
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>

              {/* Spots progress bar */}
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/60">
                <motion.div
                  className={cn("h-full rounded-full", isAlmostFull ? "bg-destructive/50" : colors.accent, "opacity-60")}
                  initial={{ width: 0 }}
                  animate={{ width: `${spotsPercent}%` }}
                  transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  )
}
