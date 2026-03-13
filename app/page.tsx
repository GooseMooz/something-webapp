"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { ArrowRight, Sparkles, Heart, TrendingUp, MapPin, Clock, Zap, Star, Leaf, UtensilsCrossed, Landmark, Trophy, CalendarHeart, BookOpen, Users, CheckCircle2, Shield, Send } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Footer } from "@/components/footer"
import { haptic } from "@/lib/haptics"
import {
  FadeIn,
  SlideUp,
  StaggerChildren,
  StaggerItem,
  ScaleOnTap,
  AnimatedCounter,
  WavyText,
  Shimmer,
} from "@/components/motion-wrapper"
import { mockOpportunities } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const cardClass = "border-border/70 bg-card shadow-sm shadow-espresso/[0.04]"

/* ── Reusable decorative asterisk ── */
function Asterisk({ size = 24, color, className = "" }: { size?: number; color: string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M12 2V22M2 12H22M4.9 4.9L19.1 19.1M19.1 4.9L4.9 19.1" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

/* ── Floating dot ── */
function FloatDot({ color, className = "" }: { color: string; className?: string }) {
  return (
    <motion.div
      className={`rounded-full ${className}`}
      style={{ backgroundColor: color }}
      animate={{ y: [-4, 4, -4] }}
      transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" }}
    />
  )
}

export default function HomePage() {
  const featured = mockOpportunities.filter((op) => op.featured).slice(0, 4)

  return (
    <div className="min-h-screen bg-background">
      {/* ── Marketing Header ── */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="sticky top-0 z-50 w-full border-b border-border/50 bg-card/85 backdrop-blur-xl"
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-espresso text-cream">
              <Sparkles className="h-4 w-4 transition-transform group-hover:rotate-12" />
            </div>
            <span className="font-serif font-semibold text-lg text-espresso">Something</span>
          </Link>
          <div className="hidden items-center gap-1 sm:flex">
            <Link href="/our-story">
              <Button variant="ghost" className="rounded-full text-sm font-medium text-espresso/55 hover:text-espresso hover:bg-latte/60">Our Story</Button>
            </Link>
            <Link href="/for-organizations">
              <Button variant="ghost" className="rounded-full text-sm font-medium text-espresso/55 hover:text-espresso hover:bg-latte/60">For Orgs</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="rounded-full border-border/70 text-sm font-medium text-espresso/70 hover:text-espresso hover:bg-latte/40 ml-1">Log In</Button>
            </Link>
            <ScaleOnTap>
              <Link href="/signup">
                <Button className="rounded-full bg-espresso text-cream hover:bg-espresso/85 text-sm font-semibold ml-1">
                  Get Started <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </Link>
            </ScaleOnTap>
          </div>
          <div className="flex items-center gap-2 sm:hidden">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="rounded-full text-sm font-medium text-espresso/60">Log In</Button>
            </Link>
            <ScaleOnTap>
              <Link href="/signup">
                <Button size="sm" className="rounded-full bg-espresso text-cream hover:bg-espresso/85 text-sm font-semibold">Join</Button>
              </Link>
            </ScaleOnTap>
          </div>
        </nav>
      </motion.header>

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-4 pb-28 pt-16 md:px-6 md:pb-40 md:pt-28">

        {/* Warm background glows */}
        <div className="pointer-events-none absolute right-[-5%] top-[-5%] h-[420px] w-[420px] rounded-full bg-matcha/10 blur-[100px]" />
        <div className="pointer-events-none absolute left-[10%] bottom-[5%] h-[300px] w-[300px] rounded-full bg-honey/10 blur-[90px]" />
        <div className="pointer-events-none absolute right-[20%] bottom-[20%] h-[200px] w-[200px] rounded-full bg-rose/8 blur-[80px]" />

        {/* ── Full-width decorative SVG layer ── */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 1200 640"
            preserveAspectRatio="xMidYMid slice"
            fill="none"
            aria-hidden="true"
          >
            {/* Main guide arc — matcha, bold, swoops from upper-left through content */}
            <motion.path
              d="M 160 60 C 100 120 80 200 140 270 C 200 340 280 360 260 440 C 245 500 200 530 190 580"
              stroke="var(--matcha)"
              strokeWidth="3.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.65 }}
              transition={{ delay: 0.7, duration: 2.2, ease: "easeOut" }}
            />
            {/* Arrowhead on main guide */}
            <motion.path
              d="M 180 568 L 190 582 L 200 568"
              stroke="var(--matcha)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.65 }}
              transition={{ delay: 2.9, duration: 0.5 }}
            />

            {/* Honey wavy line — upper right, close to content */}
            <motion.path
              d="M 680 95 C 710 72 740 118 770 95 C 800 72 830 118 860 95 C 890 72 920 118 950 95 C 980 72 1010 118 1040 95"
              stroke="var(--honey)"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{ delay: 1.1, duration: 1.4, ease: "easeOut" }}
            />

            {/* Rose playful loop — lower right */}
            <motion.path
              d="M 980 460 C 1020 420 1070 410 1080 450 C 1090 490 1050 520 1010 510 C 970 500 960 460 1000 445 C 1040 430 1080 450 1070 490"
              stroke="var(--rose)"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.58 }}
              transition={{ delay: 1.4, duration: 1.6, ease: "easeOut" }}
            />

            {/* Caramel wavy squiggle — left mid, near content */}
            <motion.path
              d="M 200 380 C 230 358 260 402 290 380 C 320 358 350 402 380 380 C 410 358 440 402 470 380"
              stroke="var(--caramel)"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.55 }}
              transition={{ delay: 1.7, duration: 1.2, ease: "easeOut" }}
            />

            {/* Matcha small squiggle right — connects toward scroll area */}
            <motion.path
              d="M 950 320 C 980 300 1010 340 1040 320 C 1070 300 1100 340 1130 320"
              stroke="var(--matcha)"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.5 }}
              transition={{ delay: 2.0, duration: 1.0, ease: "easeOut" }}
            />
          </svg>

          {/* Scattered decorative asterisks — larger, more colorful */}
          {[
            { left: "82%", top: "8%",  size: 30, color: "var(--honey)",   delay: 0.9,  rotate: 15 },
            { left: "11%", top: "22%", size: 24, color: "var(--matcha)",  delay: 1.1,  rotate: -8 },
            { left: "88%", top: "52%", size: 20, color: "var(--rose)",    delay: 1.45, rotate: 22 },
            { left: "5%",  top: "68%", size: 26, color: "var(--caramel)", delay: 1.25, rotate: 5  },
            { left: "74%", top: "82%", size: 22, color: "var(--matcha)",  delay: 1.65, rotate: -12},
            { left: "50%", top: "88%", size: 16, color: "var(--honey)",   delay: 2.1,  rotate: 30 },
          ].map((m, i) => (
            <motion.div
              key={i}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: m.left, top: m.top }}
              initial={{ opacity: 0, scale: 0, rotate: m.rotate - 40 }}
              animate={{ opacity: 0.6, scale: 1, rotate: m.rotate }}
              transition={{ delay: m.delay, duration: 0.6, type: "spring", stiffness: 180 }}
            >
              <Asterisk size={m.size} color={m.color} />
            </motion.div>
          ))}

          {/* Floating colored dots */}
          {[
            { left: "76%", top: "18%", size: "h-3 w-3",   color: "#74BA92", duration: 3.2 },
            { left: "18%", top: "72%", size: "h-4 w-4",   color: "#E2AA5E", duration: 4.1 },
            { left: "92%", top: "68%", size: "h-2.5 w-2.5", color: "#DC9292", duration: 3.6 },
            { left: "4%",  top: "42%", size: "h-3 w-3",   color: "#C19E7A", duration: 2.9 },
            { left: "62%", top: "90%", size: "h-2 w-2",   color: "#74BA92", duration: 3.8 },
          ].map((d, i) => (
            <motion.div
              key={`dot-${i}`}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full ${d.size}`}
              style={{ left: d.left, top: d.top, backgroundColor: d.color }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.55, scale: 1, y: [0, -6, 0] }}
              transition={{
                opacity: { delay: 1 + i * 0.15, duration: 0.5 },
                scale:   { delay: 1 + i * 0.15, duration: 0.5 },
                y:       { delay: 1 + i * 0.15, duration: d.duration, repeat: Infinity, ease: "easeInOut" },
              }}
            />
          ))}
        </div>

        {/* Hero content */}
        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center">
            <FadeIn delay={0.1}>
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/80 px-4 py-1.5 text-xs font-medium text-espresso/60 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-matcha animate-pulse" />
                Active pilot · Metro Vancouver
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <h1 className="max-w-4xl font-display text-5xl leading-[1.05] tracking-wide text-espresso md:text-7xl text-balance">
                Do{" "}
                <span className="relative inline-block">
                  <WavyText text="Something" className="text-matcha-dark" delay={0.5} />
                  <motion.svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 300 10"
                    fill="none"
                    aria-hidden="true"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.9, ease: "easeOut" }}
                  >
                    <motion.path
                      d="M2 6C50 2 100 1.5 150 4C200 6.5 250 3 298 5"
                      stroke="var(--matcha)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 1.2, duration: 0.9, ease: "easeOut" }}
                    />
                  </motion.svg>
                </span>
                <br />
                That Matters
              </h1>
            </FadeIn>

            <FadeIn delay={0.4}>
              <p className="mt-7 max-w-xl font-serif text-lg leading-relaxed text-espresso/60 md:text-xl text-pretty">
                Volunteer opportunities that actually match what you care about. One tap to apply — no resume, no stress. Come back next weekend and do it again.
              </p>
            </FadeIn>

            <FadeIn delay={0.55}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <ScaleOnTap>
                  <Link href="/signup">
                    <Shimmer>
                      <Button size="lg" className="rounded-full bg-matcha px-9 py-6 text-base font-semibold text-espresso hover:bg-matcha-dark">
                        Find Opportunities <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Shimmer>
                  </Link>
                </ScaleOnTap>
                <ScaleOnTap>
                  <Link href="/for-organizations">
                    <Button variant="outline" size="lg" className="rounded-full border-border/60 px-9 py-6 text-base font-medium text-espresso hover:bg-latte/60">
                      I run an organization
                    </Button>
                  </Link>
                </ScaleOnTap>
              </div>
            </FadeIn>

            <FadeIn delay={0.7}>
              <div className="mt-12 flex items-center gap-3 rounded-full bg-card/85 px-5 py-2.5 shadow-sm backdrop-blur-sm border border-border/40">
                <div className="flex -space-x-2">
                  {["bg-matcha/35", "bg-honey/40", "bg-caramel/35", "bg-rose/30", "bg-matcha/25"].map((bg, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, x: -10 }}
                      animate={{ scale: 1, x: 0 }}
                      transition={{ delay: 0.8 + i * 0.08, type: "spring", stiffness: 400 }}
                      className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-card text-xs font-semibold text-espresso/70 ${bg}`}
                    >
                      {String.fromCharCode(64 + i + 1)}
                    </motion.div>
                  ))}
                </div>
                <p className="text-sm text-espresso/50">
                  <span className="font-semibold text-espresso">2,400+</span> people already volunteering
                </p>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.8 }}
        >
          <svg width="60" height="18" viewBox="0 0 60 18" fill="none" aria-hidden="true">
            <motion.path
              d="M2 9 C9 2 18 16 27 9 C36 2 45 16 54 9 C58 6 59 7 58 9"
              stroke="var(--honey)"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.7 }}
              transition={{ delay: 2.4, duration: 1.2, ease: "easeOut" }}
            />
          </svg>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true">
              <path d="M2 2L9 10L16 2" stroke="var(--espresso)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.45" />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* ── INLINE WAITLIST ── */}
      <section className="border-y border-border/40 bg-latte/40 px-4 py-8 md:py-10">
        <div className="mx-auto max-w-xl text-center">
          <p className="font-serif text-sm italic text-espresso/55 mb-4">
            We&apos;re still in pilot mode — sign up for early access and help shape what comes next.
          </p>
          <HeroWaitlistForm />
        </div>
      </section>

      {/* ══════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════ */}
      <section className="relative px-4 py-16 md:px-6 md:py-24 overflow-hidden">
        {/* Section accent dots */}
        <div className="pointer-events-none absolute right-4 top-12 opacity-40">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
            <Asterisk size={28} color="var(--honey)" />
          </motion.div>
        </div>
        <div className="pointer-events-none absolute left-6 bottom-16 opacity-35">
          <motion.div animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }}>
            <Asterisk size={20} color="var(--caramel)" />
          </motion.div>
        </div>

        <div className="mx-auto max-w-6xl">
          <SlideUp>
            <div className="mb-14 text-center">
              <h2 className="text-3xl font-bold text-espresso md:text-4xl text-balance">How it works</h2>
              <p className="mt-3 font-serif text-sm italic text-espresso/50">You can be signed up in under five minutes.</p>
            </div>
          </SlideUp>

          <div className="grid gap-5 md:grid-cols-3 mb-8">
            {[
              { step: "01", title: "Build your profile", description: "Tell us what you're good at and what you care about. Takes about 3 minutes, then we handle the matching.", icon: Sparkles, border: "border-l-matcha", iconBg: "bg-matcha/20 text-matcha-dark", numColor: "text-matcha/15" },
              { step: "02", title: "Browse & apply", description: "Find opportunities that fit your life. One tap to apply — no cover letters, no phone screens, no waiting weeks for a reply.", icon: MapPin, border: "border-l-honey", iconBg: "bg-honey/20 text-espresso/70", numColor: "text-honey/20" },
              { step: "03", title: "Show up & grow", description: "Volunteer, earn XP, and unlock badges that tell the story of your impact. Looks great on a portfolio too.", icon: TrendingUp, border: "border-l-caramel", iconBg: "bg-caramel/20 text-espresso/70", numColor: "text-caramel/20" },
            ].map((step, i) => (
              <SlideUp key={step.step} delay={i * 0.12}>
                <motion.div whileHover={{ y: -5, scale: 1.01 }} transition={{ type: "spring", stiffness: 300 }} className="h-full">
                  <Card className={cn(cardClass, "relative overflow-hidden h-full border-l-[3px]", step.border)}>
                    <CardContent className="flex flex-col gap-4 p-6 pt-8">
                      <div className="flex items-center gap-3">
                        <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", step.iconBg)}>
                          <step.icon className="h-5 w-5" />
                        </div>
                        <span className={cn("text-5xl font-bold", step.numColor)}>{step.step}</span>
                      </div>
                      <h3 className="text-base font-semibold text-espresso">{step.title}</h3>
                      <p className="font-serif text-sm leading-relaxed text-espresso/55">{step.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </SlideUp>
            ))}
          </div>

          <SlideUp delay={0.3}>
            <Card className={cn(cardClass, "max-w-2xl mx-auto bg-latte/25 border-l-[3px] border-l-border/60")}>
              <CardContent className="p-5 flex items-start gap-3">
                <Shield className="h-4 w-4 text-espresso/35 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-espresso mb-1">One thing to know</p>
                  <p className="font-serif text-xs text-espresso/50 leading-relaxed">
                    Volunteering through Something connects you with opportunities, but doesn&apos;t make you a formal member of the host organization. If you want to join one long-term, we&apos;ll point you to their own process.
                  </p>
                </div>
              </CardContent>
            </Card>
          </SlideUp>
        </div>
      </section>

      {/* Decorative wavy section divider */}
      <WavyDivider color="var(--matcha)" opacity={0.18} />

      {/* ══════════════════════════════════════════
          XP SYSTEM
      ══════════════════════════════════════════ */}
      <section className="relative px-4 py-16 md:px-6 md:py-24 overflow-hidden">
        <div className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 opacity-30">
          <motion.div animate={{ y: [-8, 8, -8] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
            <Asterisk size={36} color="var(--honey)" />
          </motion.div>
        </div>
        <div className="pointer-events-none absolute right-2 bottom-8 opacity-25">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}>
            <Asterisk size={22} color="var(--rose)" />
          </motion.div>
        </div>

        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <SlideUp>
              <div>
                <Badge className="mb-5 rounded-full border-honey/40 bg-honey/15 px-4 py-1.5 text-xs font-medium text-espresso/80">
                  <Trophy className="mr-1.5 h-3 w-3" />
                  The XP System
                </Badge>
                <h2 className="text-3xl font-bold text-espresso md:text-4xl text-balance mb-5">
                  Why we turned volunteering into a game
                </h2>
                <p className="font-serif text-sm text-espresso/55 leading-relaxed mb-4">
                  Volunteer logs shouldn&apos;t live on a spreadsheet. Every hour you give back becomes part of your profile — something you can point to in a job application, a school essay, or just a conversation with a friend.
                </p>
                <p className="font-serif text-sm text-espresso/55 leading-relaxed mb-7">
                  The XP system isn&apos;t about competition. It&apos;s about having something to show for all the early mornings and late afternoons you showed up for.
                </p>
                <div className="flex flex-col gap-3">
                  {[
                    { text: "Earn XP for every hour you volunteer",            color: "text-matcha-dark" },
                    { text: "Unlock badges tied to the causes you care about", color: "text-honey" },
                    { text: "Top volunteers get access to exclusive events",   color: "text-caramel" },
                    { text: "Export your impact history for school or job apps", color: "text-rose" },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-2.5 text-espresso/60">
                      <CheckCircle2 className={cn("h-4 w-4 shrink-0", item.color)} />
                      <span className="font-serif text-sm">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </SlideUp>

            <SlideUp delay={0.1}>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Earn XP", value: "150+", sub: "per session",    icon: Star,         bg: "bg-matcha/20",  text: "text-matcha-dark", border: "border-matcha/25" },
                  { label: "Badges",  value: "25+",  sub: "to unlock",      icon: Trophy,       bg: "bg-honey/20",   text: "text-espresso/80", border: "border-honey/25"  },
                  { label: "Levels",  value: "10",   sub: "to climb",       icon: TrendingUp,   bg: "bg-caramel/20", text: "text-espresso/70", border: "border-caramel/25"},
                  { label: "Perks",   value: "VIP",  sub: "events & recs",  icon: CalendarHeart, bg: "bg-rose/15",   text: "text-rose",        border: "border-rose/20"   },
                ].map((stat) => (
                  <motion.div key={stat.label} whileHover={{ y: -5, scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Card className={cn(cardClass, "h-full border-2", stat.border)}>
                      <CardContent className="p-5 flex flex-col items-center text-center gap-2">
                        <div className={cn("flex h-11 w-11 items-center justify-center rounded-lg", stat.bg, stat.text)}>
                          <stat.icon className="h-5 w-5" />
                        </div>
                        <p className="text-2xl font-bold text-espresso">{stat.value}</p>
                        <p className="font-serif text-xs italic text-espresso/40">{stat.sub}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </SlideUp>
          </div>
        </div>
      </section>

      <WavyDivider color="var(--honey)" opacity={0.15} flip />

      {/* ══════════════════════════════════════════
          FOCUS AREAS
      ══════════════════════════════════════════ */}
      <section className="relative px-4 py-16 md:px-6 md:py-24 bg-latte/35 overflow-hidden">
        <div className="pointer-events-none absolute right-8 top-8 opacity-30">
          <motion.div animate={{ y: [-6, 6, -6] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
            <Asterisk size={24} color="var(--caramel)" />
          </motion.div>
        </div>
        <div className="mx-auto max-w-6xl">
          <SlideUp>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-espresso md:text-4xl text-balance mb-3">Where we focus right now</h2>
              <p className="font-serif text-sm italic text-espresso/50 max-w-md mx-auto">
                Three areas where Metro Vancouver youth can make the most tangible difference.
              </p>
            </div>
          </SlideUp>
          <StaggerChildren className="grid gap-5 md:grid-cols-3">
            {[
              { icon: Leaf,            title: "Environmental",    description: "Beach cleanups, trail restoration, community gardens, climate action. Get your hands in the dirt and see the results.", iconBg: "bg-matcha/20 text-matcha-dark",   cardBorder: "border-t-[3px] border-t-matcha/40",   dotColor: "bg-matcha/30" },
              { icon: Landmark,        title: "Civic & Community", description: "Welcome events for newcomers, senior socials, neighbourhood building. The kind of work that creates real friendships.", iconBg: "bg-honey/20 text-espresso/70",    cardBorder: "border-t-[3px] border-t-honey/40",    dotColor: "bg-honey/40"  },
              { icon: UtensilsCrossed, title: "Food & Agriculture", description: "Food bank sorting, community kitchen shifts, urban farming. Nourish your community, literally.",                       iconBg: "bg-caramel/20 text-espresso/70", cardBorder: "border-t-[3px] border-t-caramel/40",  dotColor: "bg-caramel/35"},
            ].map((area) => (
              <StaggerItem key={area.title}>
                <motion.div whileHover={{ y: -6, scale: 1.01 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Card className={cn(cardClass, "h-full relative overflow-hidden", area.cardBorder)}>
                    <CardContent className="p-6 pt-7 flex flex-col gap-4">
                      <div className="flex items-start justify-between">
                        <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", area.iconBg)}>
                          <area.icon className="h-6 w-6" />
                        </div>
                        <div className={cn("h-3 w-3 rounded-full mt-1", area.dotColor)} />
                      </div>
                      <h3 className="text-base font-semibold text-espresso">{area.title}</h3>
                      <p className="font-serif text-sm text-espresso/50 leading-relaxed">{area.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      <WavyDivider color="var(--caramel)" opacity={0.14} />

      {/* ══════════════════════════════════════════
          FEATURED OPPORTUNITIES
      ══════════════════════════════════════════ */}
      <section className="relative px-4 py-16 md:px-6 md:py-24 overflow-hidden">
        <div className="pointer-events-none absolute left-4 top-16 opacity-30">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 22, repeat: Infinity, ease: "linear" }}>
            <Asterisk size={26} color="var(--matcha)" />
          </motion.div>
        </div>

        <div className="relative z-10 mx-auto max-w-6xl">
          <SlideUp>
            <div className="mb-12 flex flex-col items-center text-center">
              <Badge className="mb-5 rounded-full border-matcha/35 bg-matcha/12 px-5 py-2 text-sm font-medium text-matcha-dark">
                <Zap className="mr-1.5 h-3.5 w-3.5" />
                Happening Soon
              </Badge>
              <h2 className="text-3xl font-bold text-espresso md:text-4xl text-balance">Real opportunities, real orgs</h2>
              <p className="mt-3 font-serif max-w-lg text-sm italic text-espresso/50">
                One tap to apply. Show up, make an impact.
              </p>
            </div>
          </SlideUp>

          <StaggerChildren className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((op) => (
              <StaggerItem key={op.id} className="h-full">
                <FeaturedCard opportunity={op} />
              </StaggerItem>
            ))}
          </StaggerChildren>

          <SlideUp delay={0.3}>
            <div className="mt-12 flex justify-center">
              <ScaleOnTap>
                <Link href="/opportunities">
                  <Button variant="outline" size="lg" className="rounded-full border-border/70 px-9 py-6 font-medium text-espresso hover:bg-latte/50">
                    Browse all opportunities <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </ScaleOnTap>
            </div>
          </SlideUp>
        </div>
      </section>

      <WavyDivider color="var(--rose)" opacity={0.13} flip />

      {/* ══════════════════════════════════════════
          COMMUNITY PARTNERS
      ══════════════════════════════════════════ */}
      <section className="relative px-4 py-16 md:px-6 md:py-24 bg-latte/40 overflow-hidden">
        <div className="pointer-events-none absolute right-6 bottom-8 opacity-30">
          <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}>
            <Asterisk size={22} color="var(--honey)" />
          </motion.div>
        </div>
        <div className="mx-auto max-w-6xl">
          <SlideUp>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-espresso md:text-4xl text-balance mb-3">Our community partners</h2>
              <p className="font-serif text-sm italic text-espresso/50 max-w-md mx-auto">
                The organizations that make it possible.
              </p>
            </div>
          </SlideUp>

          <StaggerChildren className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { org: "Nature Vancouver",  program: "New Brighton Park Restoration", abbr: "NV", iconBg: "bg-matcha/20 text-matcha-dark",   border: "border-matcha/25" },
              { org: "DIVERSECity",       program: "Youth for People & the Planet", abbr: "DC", iconBg: "bg-honey/20 text-espresso/80",    border: "border-honey/25"  },
              { org: "Apathy is Boring",  program: "RISE",                          abbr: "AB", iconBg: "bg-caramel/20 text-espresso/70",  border: "border-caramel/25"},
              { org: "CityHive",          program: "Youth Climate Action",          abbr: "CH", iconBg: "bg-rose/15 text-rose",            border: "border-rose/20"   },
            ].map((partner) => (
              <StaggerItem key={partner.org}>
                <motion.div whileHover={{ y: -5, scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Card className={cn(cardClass, "h-full border-2", partner.border)}>
                    <CardContent className="p-5 flex flex-col items-center text-center gap-3">
                      <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl font-bold text-sm", partner.iconBg)}>
                        {partner.abbr}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-espresso">{partner.org}</h3>
                        <p className="font-serif text-[11px] italic text-espresso/45 mt-1">{partner.program}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      <WavyDivider color="var(--matcha)" opacity={0.15} />

      {/* ══════════════════════════════════════════
          ACTIVE PILOT + FEEDBACK
      ══════════════════════════════════════════ */}
      <section className="relative px-4 py-16 md:px-6 md:py-24 overflow-hidden">
        <div className="pointer-events-none absolute right-4 top-20 opacity-25">
          <motion.div animate={{ rotate: -360 }} transition={{ duration: 28, repeat: Infinity, ease: "linear" }}>
            <Asterisk size={32} color="var(--caramel)" />
          </motion.div>
        </div>
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-2 items-start">
            <SlideUp>
              <div>
                <Badge className="mb-5 rounded-full border-matcha/35 bg-matcha/12 px-4 py-1.5 text-xs font-medium text-matcha-dark">
                  Active Pilot
                </Badge>
                <h2 className="text-3xl font-bold text-espresso md:text-4xl text-balance mb-5">
                  We&apos;re building this together.
                </h2>
                <p className="font-serif text-sm text-espresso/55 leading-relaxed mb-3">
                  Something is a live pilot based in Metro Vancouver. We&apos;re working with a small group of organizations and volunteers, and iterating based on real feedback from real people.
                </p>
                <p className="font-serif text-sm text-espresso/55 leading-relaxed mb-7">
                  Every feature, every flow, every small decision is shaped by the people using it. If something doesn&apos;t feel right, we genuinely want to know.
                </p>

                <Card className={cn(cardClass, "overflow-hidden mb-5 border-l-[3px] border-l-matcha/50")}>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-matcha/10 shrink-0">
                        <Image src="/images/cathy-luo.jpg" alt="Cathy Luo, founder of Something" fill className="object-cover" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-espresso">Cathy Luo</h3>
                        <p className="font-serif text-[11px] italic text-espresso/45">Founder, Something</p>
                      </div>
                    </div>
                    <p className="font-serif text-xs text-espresso/55 leading-relaxed italic">
                      &ldquo;I built Something because I was tired of volunteering feeling like homework. It should feel like showing up for your people — because that&apos;s exactly what it is.&rdquo;
                    </p>
                  </CardContent>
                </Card>

                <ScaleOnTap>
                  <Link href="/our-story">
                    <Button variant="outline" className="rounded-full border-border/60 text-sm font-medium text-espresso hover:bg-latte/50">
                      Our story <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Button>
                  </Link>
                </ScaleOnTap>
              </div>
            </SlideUp>

            <SlideUp delay={0.1}>
              <FeedbackForm />
            </SlideUp>
          </div>
        </div>
      </section>

      <WavyDivider color="var(--honey)" opacity={0.14} flip />

      {/* ══════════════════════════════════════════
          WHAT'S COMING
      ══════════════════════════════════════════ */}
      <section className="relative px-4 py-16 md:px-6 md:py-24 bg-latte/40 overflow-hidden">
        <div className="pointer-events-none absolute left-4 top-12 opacity-30">
          <motion.div animate={{ y: [-7, 7, -7] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
            <Asterisk size={26} color="var(--rose)" />
          </motion.div>
        </div>
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-2 items-start">
            <SlideUp>
              <div>
                <Badge className="mb-5 rounded-full border-rose/30 bg-rose/10 px-4 py-1.5 text-xs font-medium text-rose">
                  What&apos;s coming
                </Badge>
                <h2 className="text-3xl font-bold text-espresso md:text-4xl text-balance mb-4">Just getting started</h2>
                <p className="font-serif text-sm text-espresso/55 leading-relaxed">
                  Here&apos;s what&apos;s on the roadmap — shaped by the people already using Something.
                </p>
              </div>
            </SlideUp>

            <SlideUp delay={0.1}>
              <div className="flex flex-col gap-3">
                {[
                  { title: "Volunteer Buddies & Crews", description: "Get matched with a buddy or join a regular crew for ongoing projects. Never show up alone.", icon: Users,        iconBg: "bg-matcha/20 text-matcha-dark",   tag: "Community" },
                  { title: "Climate Cafes",             description: "Casual pop-up events where youth talk climate action over drinks. Think meetup, not lecture.",          icon: CalendarHeart, iconBg: "bg-honey/20 text-espresso/70",    tag: "Events"    },
                  { title: "Volunteer socials",         description: "Movie nights, game tournaments, and potlucks for our most active volunteers.",                           icon: Heart,        iconBg: "bg-rose/15 text-rose",            tag: "Community" },
                  { title: "Learning resources",        description: "Curated guides, workshops, and micro-certifications to build skills while you give back.",               icon: BookOpen,     iconBg: "bg-caramel/20 text-espresso/70",  tag: "Learning"  },
                ].map((item) => (
                  <motion.div key={item.title} whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Card className={cn(cardClass, "overflow-hidden")}>
                      <CardContent className="p-4 flex items-start gap-4">
                        <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg shrink-0", item.iconBg)}>
                          <item.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-semibold text-espresso">{item.title}</h3>
                            <Badge className="rounded-full border-none bg-espresso/5 text-espresso/40 text-[10px] font-medium">{item.tag}</Badge>
                          </div>
                          <p className="font-serif text-xs text-espresso/50 leading-relaxed">{item.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </SlideUp>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════ */}
      <section className="px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-4xl">
          <SlideUp>
            <Card className="relative overflow-hidden border-none bg-espresso">
              {/* Floating colored shapes inside CTA */}
              {[
                { color: "#74BA92", size: "h-3 w-3", top: "15%", left: "8%",  dur: 3.5 },
                { color: "#E2AA5E", size: "h-2 w-2", top: "70%", left: "15%", dur: 4.2 },
                { color: "#DC9292", size: "h-4 w-4", top: "20%", left: "88%", dur: 3.8 },
                { color: "#C19E7A", size: "h-2 w-2", top: "75%", left: "80%", dur: 5.0 },
                { color: "#74BA92", size: "h-2 w-2", top: "50%", left: "5%",  dur: 4.5 },
                { color: "#E2AA5E", size: "h-3 w-3", top: "45%", left: "92%", dur: 3.2 },
              ].map((dot, i) => (
                <motion.div
                  key={i}
                  className={`pointer-events-none absolute rounded-full opacity-35 ${dot.size}`}
                  style={{ top: dot.top, left: dot.left, backgroundColor: dot.color }}
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: dot.dur, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                />
              ))}
              <CardContent className="relative z-10 flex flex-col items-center gap-7 p-10 text-center md:p-16">
                <motion.div
                  animate={{ rotate: [0, 8, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="flex h-14 w-14 items-center justify-center rounded-xl bg-matcha/25"
                >
                  <Heart className="h-7 w-7 text-matcha" />
                </motion.div>
                <h2 className="text-3xl font-bold text-cream md:text-5xl text-balance">Ready to show up?</h2>
                <p className="font-serif max-w-lg text-base text-cream/55 leading-relaxed md:text-lg text-pretty">
                  Find something worth giving your time to. It might change how you spend your weekends.
                </p>
                <ScaleOnTap>
                  <Link href="/signup">
                    <Shimmer>
                      <Button size="lg" className="rounded-full bg-matcha px-9 py-6 text-base font-semibold text-espresso hover:bg-matcha-dark">
                        Get started <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Shimmer>
                  </Link>
                </ScaleOnTap>
              </CardContent>
            </Card>
          </SlideUp>
        </div>
      </section>

      <Footer />
    </div>
  )
}

/* ── Wavy section divider ── */
function WavyDivider({ color, opacity, flip = false }: { color: string; opacity: number; flip?: boolean }) {
  return (
    <div className={cn("pointer-events-none overflow-hidden py-1", flip && "scale-x-[-1]")} aria-hidden="true">
      <svg viewBox="0 0 1200 28" className="w-full" fill="none" preserveAspectRatio="none">
        <path
          d="M0 14 C100 4 200 24 300 14 C400 4 500 24 600 14 C700 4 800 24 900 14 C1000 4 1100 24 1200 14"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          style={{ opacity }}
        />
        <path
          d="M0 20 C120 10 240 30 360 20 C480 10 600 30 720 20 C840 10 960 30 1080 20 C1140 15 1180 18 1200 20"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{ opacity: opacity * 0.6 }}
        />
      </svg>
    </div>
  )
}

/* ── Featured Card ── */
function FeaturedCard({ opportunity }: { opportunity: (typeof mockOpportunities)[number] }) {
  const styles: Record<string, { badge: string; border: string }> = {
    Environment:    { badge: "bg-matcha/18 text-matcha-dark",   border: "border-t-[3px] border-t-matcha/40"   },
    Education:      { badge: "bg-honey/18 text-espresso/70",    border: "border-t-[3px] border-t-honey/40"    },
    Community:      { badge: "bg-caramel/18 text-espresso/70",  border: "border-t-[3px] border-t-caramel/35"  },
    "Arts & Culture":{ badge: "bg-rose/15 text-rose",           border: "border-t-[3px] border-t-rose/30"    },
  }
  const s = styles[opportunity.category] ?? { badge: "bg-muted text-muted-foreground", border: "" }
  return (
    <ScaleOnTap className="w-full h-full">
      <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }} className="h-full">
        <Card className={cn(cardClass, "group h-full overflow-hidden transition-shadow hover:shadow-md hover:shadow-espresso/[0.07]", s.border)}>
          <CardContent className="flex h-full flex-col gap-3 p-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-latte font-semibold text-xs text-espresso/70 shrink-0">
                {opportunity.organization.charAt(0)}
              </div>
              <span className="font-serif text-xs italic text-espresso/50 truncate">{opportunity.organization}</span>
              {opportunity.urgent && (
                <Badge className="ml-auto rounded-full border-none bg-destructive/10 text-destructive text-[10px] font-medium px-2 py-0.5 shrink-0">
                  <Zap className="mr-0.5 h-2.5 w-2.5" /> Urgent
                </Badge>
              )}
            </div>
            <h3 className="text-sm font-semibold leading-snug text-espresso text-balance">{opportunity.title}</h3>
            <Badge className={cn("w-fit rounded-full border-none text-xs font-medium", s.badge)}>
              {opportunity.category}
            </Badge>
            <div className="mt-auto flex items-center justify-between pt-3 border-t border-border/40">
              <div className="flex items-center gap-1 text-xs font-semibold text-matcha-dark">
                <Star className="h-3 w-3 fill-matcha text-matcha" /> {opportunity.xpReward} XP
              </div>
              <div className="flex items-center gap-1 font-serif text-xs italic text-espresso/40">
                <Clock className="h-3 w-3" /> {opportunity.timeCommitment}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </ScaleOnTap>
  )
}

/* ── Hero Waitlist Form ── */
function HeroWaitlistForm() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    haptic("medium")
    setStatus("loading")
    try {
      const res = await fetch("/api/waitlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) })
      if (res.ok) { haptic("success"); setStatus("success"); setEmail("") } else { haptic("error"); setStatus("error") }
    } catch { haptic("error"); setStatus("error") }
  }

  if (status === "success") {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center justify-center gap-2 font-serif italic text-sm text-matcha-dark">
        <CheckCircle2 className="h-4 w-4" /> You&apos;re on the list! We&apos;ll be in touch.
      </motion.div>
    )
  }
  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto">
      <Input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1 rounded-full border-border/60 bg-card/80 text-sm h-11" disabled={status === "loading"} />
      <ScaleOnTap>
        <Button type="submit" disabled={status === "loading" || !email} className="rounded-full bg-espresso text-cream hover:bg-espresso/85 font-semibold text-sm px-6 h-11">
          {status === "loading" ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="h-4 w-4 rounded-full border-2 border-cream/20 border-t-cream" /> : "Join waitlist"}
        </Button>
      </ScaleOnTap>
    </form>
  )
}

/* ── Feedback Form ── */
function FeedbackForm() {
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    setStatus("loading")
    try {
      const res = await fetch("/api/feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message }) })
      if (res.ok) { setStatus("success"); setMessage("") } else setStatus("error")
    } catch { setStatus("error") }
  }

  return (
    <Card className={cn(cardClass, "overflow-hidden border-l-[3px] border-l-honey/50")}>
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <Send className="h-4 w-4 text-honey" />
          <h3 className="text-sm font-semibold text-espresso">Share a thought</h3>
        </div>
        <p className="font-serif text-xs text-espresso/50 mb-4 italic">
          Have an idea, a question, or something that bugged you? We read every message.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Textarea
            placeholder="What would make Something better for you?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="rounded-xl border-border/60 bg-latte/30 font-serif text-sm min-h-[80px] resize-none"
            disabled={status === "loading" || status === "success"}
          />
          <ScaleOnTap className="self-end">
            <Button type="submit" disabled={status === "loading" || status === "success" || !message.trim()} className="rounded-full bg-honey text-espresso hover:bg-honey/85 font-semibold text-sm px-5">
              {status === "loading" ? "Sending..." : status === "success" ? "Sent! Thank you." : "Send"}
            </Button>
          </ScaleOnTap>
        </form>
        <AnimatePresence>
          {status === "error" && (
            <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="font-serif text-xs italic text-destructive mt-2">
              Something went wrong. Try again?
            </motion.p>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
