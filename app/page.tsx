"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import React from "react"
import { ArrowRight, Sparkles, Heart, TrendingUp, MapPin, Clock, Zap, Star, Leaf, UtensilsCrossed, Landmark, Trophy, CalendarHeart, CheckCircle2, Shield, Send } from "lucide-react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Footer } from "@/components/footer"
import {
  FadeIn,
  SlideUp,
  StaggerChildren,
  StaggerItem,
  ScaleOnTap,
  WavyText,
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

export default function HomePage() {
  const featured = mockOpportunities.filter((op) => op.featured)

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
            <div className="ml-1 h-4 w-px bg-border/60" />
            <Link href="/login">
              <Button variant="ghost" className="rounded-full text-sm font-medium text-espresso/55 hover:text-espresso hover:bg-latte/60">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button className="rounded-full bg-espresso text-cream text-sm font-semibold px-5 h-9 hover:bg-espresso/90">Sign up</Button>
            </Link>
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
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/signup">
                  <Button className="rounded-full bg-espresso text-cream font-semibold px-8 h-11 text-sm hover:bg-espresso/90 shadow-md">
                    Volunteer now <ArrowRight className="ml-1.5 h-4 w-4 inline" />
                  </Button>
                </Link>
                <Link href="/org/signup">
                  <Button variant="outline" className="rounded-full border-espresso/20 text-espresso/60 font-semibold px-8 h-11 text-sm hover:bg-latte/50 hover:text-espresso">
                    I&apos;m an organization
                  </Button>
                </Link>
              </div>
            </FadeIn>

            <FadeIn delay={0.7}>
              <div className="mt-8 flex items-center gap-3 rounded-full bg-card/85 px-5 py-2.5 shadow-sm backdrop-blur-sm border border-border/40">
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
                  <MysteryNumber /> people already
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

      <div className="relative h-10 overflow-visible">
        <CurvedArrow color="var(--matcha)" className="absolute left-[18%] -top-2" delay={0.2} />
        <CurvedArrow color="var(--honey)" className="absolute right-[22%] -top-1" delay={0.4} flip />
      </div>

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

      {/* ── Arrow: how it works → XP ── */}
      <div className="relative h-10 overflow-visible">
        <CurvedArrow color="var(--caramel)" className="absolute right-[15%] -top-3" delay={0.1} flip />
      </div>

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

      {/* ── Arrow: XP → Focus Areas ── */}
      <div className="relative h-10 overflow-visible">
        <CurvedArrow color="var(--honey)" className="absolute left-[25%] -top-2" delay={0.15} />
      </div>

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
              { icon: UtensilsCrossed, title: "Food", description: "Food bank sorting, community kitchen shifts, urban farming. Nourish your community, literally.",                       iconBg: "bg-caramel/20 text-espresso/70", cardBorder: "border-t-[3px] border-t-caramel/40",  dotColor: "bg-caramel/35"},
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

      {/* ── Arrow: Focus Areas → Opportunities ── */}
      <div className="relative h-10 overflow-visible">
        <CurvedArrow color="var(--rose)" className="absolute right-[20%] -top-3" delay={0.1} flip />
        <CurvedArrow color="var(--matcha)" className="absolute left-[12%] -top-1" delay={0.3} />
      </div>

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

          <div className="relative">
            {/* Ghost cards peeking from left — desktop only */}
            <div className="hidden lg:block pointer-events-none absolute -left-2 top-0 bottom-0 w-[130px] z-10">
              <div className="h-full flex flex-col gap-4 opacity-35" style={{ filter: "blur(2.5px)", transform: "scale(0.95)", transformOrigin: "right center" }}>
                {mockOpportunities.filter(op => !op.featured).slice(0, 2).map((op, i) => (
                  <div key={op.id} className="flex-1 min-h-0"><FeaturedCard opportunity={op} index={i} /></div>
                ))}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background" />
            </div>

            {/* Main grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mx-auto max-w-sm sm:max-w-3xl">
              {featured.slice(0, 3).map((op, i) => (
                <FeaturedCard key={op.id} opportunity={op} index={i} />
              ))}
            </div>

            {/* Ghost cards peeking from right — desktop only */}
            <div className="hidden lg:block pointer-events-none absolute -right-2 top-0 bottom-0 w-[130px] z-10">
              <div className="h-full flex flex-col gap-4 opacity-35" style={{ filter: "blur(2.5px)", transform: "scale(0.95)", transformOrigin: "left center" }}>
                {mockOpportunities.filter(op => !op.featured).slice(2, 4).map((op, i) => (
                  <div key={op.id} className="flex-1 min-h-0"><FeaturedCard opportunity={op} index={i} /></div>
                ))}
              </div>
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-background" />
            </div>
          </div>

        </div>
      </section>

      <WavyDivider color="var(--rose)" opacity={0.13} flip />

      {/* ── Arrow: Opportunities → Partners ── */}
      <div className="relative h-10 overflow-visible">
        <CurvedArrow color="var(--sky)" className="absolute left-[30%] -top-2" delay={0.1} />
      </div>

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

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <PartnerCard
              org="Nature Vancouver"
              program="New Brighton Park Restoration"
              abbr="NV"
              logoSrc="/images/nature_vancouver.png"
              iconBg="bg-white"
              border="border-matcha/25"
              effect="nature"
            />
            <PartnerCard
              org="DIVERSECity"
              program="Youth for People & the Planet"
              abbr="DC"
              logoSrc="/images/DIVERSECity.png"
              iconBg="bg-white"
              border="border-honey/25"
              effect="city"
            />
            <PartnerCard
              org="Apathy is Boring"
              program="RISE"
              abbr="AB"
              logoSrc="/images/AisB.jpg"
              iconBg="bg-white"
              border="border-caramel/25"
              effect="apathy"
            />
            <PartnerCard
              org="CityHive"
              program="Youth Civic Action"
              abbr="CH"
              logoSrc="/images/CityHive.png"
              iconBg="bg-white"
              border="border-rose/20"
              effect="hive"
            />
            <PartnerCard
              org="VNFN"
              program="Food Security and Justice"
              abbr="VN"
              logoSrc="/images/VNFN-2025Logo.png"
              iconBg="bg-white"
              border="border-honey/30"
              effect="food"
            />
          </div>
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
                <h2 className="text-3xl font-bold text-espresso md:text-4xl text-balance mb-7">
                  We&apos;re building this together.
                </h2>

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
              <MailFeedback />
            </SlideUp>
          </div>
        </div>
      </section>

      <WavyDivider color="var(--honey)" opacity={0.14} flip />

      {/* ── Arrow: Pilot/Feedback → What's Coming ── */}
      <div className="relative h-10 overflow-visible">
        <CurvedArrow color="var(--caramel)" className="absolute right-[28%] -top-1" delay={0.2} flip />
      </div>

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
              <div className="relative grid grid-cols-2 gap-6 pt-4">
                {[
                  {
                    title: "Volunteer Buddies & Crews",
                    emoji: "🫂",
                    color: "var(--matcha)",
                    bg: "bg-matcha/12",
                    border: "border-matcha/25",
                    delay: 0,
                    dur: 3.4,
                    shape: "68% 32% 55% 45% / 45% 55% 45% 55%",
                    tag: "Community",
                  },
                  {
                    title: "Climate Cafes",
                    emoji: "☕",
                    color: "var(--honey)",
                    bg: "bg-honey/15",
                    border: "border-honey/30",
                    delay: 0.5,
                    dur: 3.8,
                    shape: "45% 55% 65% 35% / 60% 40% 60% 40%",
                    tag: "Events",
                  },
                  {
                    title: "Volunteer Socials",
                    emoji: "🎉",
                    color: "var(--rose)",
                    bg: "bg-rose/12",
                    border: "border-rose/25",
                    delay: 0.25,
                    dur: 4.1,
                    shape: "55% 45% 40% 60% / 50% 60% 40% 50%",
                    tag: "Community",
                  },
                  {
                    title: "Learning Resources",
                    emoji: "📚",
                    color: "var(--caramel)",
                    bg: "bg-caramel/15",
                    border: "border-caramel/30",
                    delay: 0.75,
                    dur: 3.6,
                    shape: "40% 60% 55% 45% / 55% 45% 55% 45%",
                    tag: "Learning",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: item.dur, repeat: Infinity, ease: "easeInOut", delay: item.delay }}
                    whileHover={{ scale: 1.06 }}
                    className="flex items-center justify-center"
                  >
                    <motion.div
                      className={cn("w-full p-5 border-2 shadow-sm cursor-default flex flex-col items-center text-center gap-3", item.bg, item.border)}
                      style={{ borderRadius: item.shape }}
                      initial={{ opacity: 0, scale: 0.7, rotate: -5 }}
                      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 200, damping: 18, delay: i * 0.12 }}
                    >
                      <span className="text-3xl leading-none" role="img" aria-label={item.title}>
                        {item.emoji}
                      </span>
                      <p className="text-xs font-semibold text-espresso leading-snug">{item.title}</p>
                      <span
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: item.color + "22", color: item.color }}
                      >
                        {item.tag}
                      </span>
                    </motion.div>
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
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link href="/signup">
                    <Button className="rounded-full bg-honey text-espresso font-semibold px-8 h-11 text-sm hover:bg-honey/90 shadow-md">
                      Sign up to volunteer <ArrowRight className="ml-1.5 h-4 w-4 inline" />
                    </Button>
                  </Link>
                  <Link href="/org/signup">
                    <Button variant="ghost" className="rounded-full text-cream/60 hover:text-cream hover:bg-cream/10 font-semibold px-8 h-11 text-sm">
                      Register an organization
                    </Button>
                  </Link>
                </div>
                <a href="mailto:hi@somethingmatters.ca">
                  <Button variant="ghost" className="rounded-full text-cream/50 hover:text-cream hover:bg-cream/10 text-sm font-medium">
                    or say hi at hi@somethingmatters.ca
                  </Button>
                </a>
              </CardContent>
            </Card>
          </SlideUp>
        </div>
      </section>

      <Footer />
    </div>
  )
}

/* ── Mystery Number — slowly morphing blob ── */
function MysteryNumber() {
  return (
    <span className="relative inline-flex items-center justify-center align-middle mx-1" style={{ width: 52, height: 26 }}>
      <motion.span
        className="absolute inset-0 bg-espresso/12"
        animate={{
          borderRadius: [
            "60% 40% 55% 45% / 50% 60% 40% 50%",
            "45% 55% 40% 60% / 60% 40% 55% 45%",
            "55% 45% 65% 35% / 40% 60% 50% 50%",
            "40% 60% 50% 50% / 55% 45% 60% 40%",
            "60% 40% 55% 45% / 50% 60% 40% 50%",
          ],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <span className="relative z-10 font-semibold text-espresso/30 text-xs select-none" style={{ filter: "blur(2px)", letterSpacing: "0.08em" }}>
        ???
      </span>
    </span>
  )
}

/* ── Partner Card with unique hover effects ── */
function PartnerCard({
  org, program, abbr, logoSrc, iconBg, border, effect,
}: {
  org: string; program: string; abbr: string; logoSrc?: string; iconBg: string; border: string;
  effect: "nature" | "city" | "apathy" | "hive" | "food"
}) {
  const [hovered, setHovered] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, margin: "-25% 0px -25% 0px" })

  React.useEffect(() => {
    setIsMobile(window.matchMedia("(pointer: coarse)").matches)
  }, [])

  // Desktop: hover only. Mobile: scroll to center of screen only.
  const showEffect = hovered || (isMobile && isInView)

  return (
    <StaggerItem>
      {/* Outer wrapper manages all three layers */}
      <div
        ref={ref}
        className="relative"
        style={{ isolation: "isolate" }}
        onMouseEnter={() => !isMobile && setHovered(true)}
        onMouseLeave={() => !isMobile && setHovered(false)}
      >
        {/* LAYER 0: behind-card overlay — city buildings, food items */}
        {(effect === "city" || effect === "food") && (
          <div className="absolute pointer-events-none" style={{ inset: -28, zIndex: 0, overflow: "visible" }}>
            {effect === "city" && <CityOverlay hovered={showEffect} />}
            {effect === "food" && <FoodOverlay hovered={showEffect} />}
          </div>
        )}

        {/* LAYER 1: card itself */}
        <motion.div
          whileHover={{ y: -5, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          style={{ position: "relative", zIndex: 1 }}
        >
          <Card className={cn(cardClass, "h-full border-2", border)}>
            <CardContent className="relative z-10 p-5 flex flex-col items-center text-center gap-3">
              <div className={cn("flex h-14 w-14 items-center justify-center rounded-xl font-bold text-sm overflow-hidden", iconBg)}>
                {logoSrc ? (
                  <Image src={logoSrc} alt={org} width={56} height={56} className="object-contain w-full h-full p-1" />
                ) : (
                  abbr
                )}
              </div>
              <div>
                <h3 className="text-base font-bold text-espresso">{org}</h3>
                <p className="font-serif text-xs text-espresso mt-1">{program}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* LAYER 2: around-card overlay — nature vines, apathy bursts, hive confetti */}
        {(effect === "nature" || effect === "apathy" || effect === "hive") && (
          <div className="absolute pointer-events-none" style={{ inset: -28, zIndex: 2, overflow: "visible" }}>
            {effect === "nature" && <NatureOverlay hovered={showEffect} />}
            {effect === "apathy" && <ApathyOverlay hovered={showEffect} />}
            {effect === "hive"   && <HiveOverlay   hovered={showEffect} />}
          </div>
        )}
      </div>
    </StaggerItem>
  )
}

function NatureOverlay({ hovered }: { hovered: boolean }) {
  // Vines grow around all 4 sides of the card frame, staying in the ~28px margin
  return (
    <svg width="100%" height="100%" viewBox="0 0 256 240" fill="none" overflow="visible">
      {/* Bottom edge vine — left to right along card bottom */}
      <motion.path
        d="M28 212 C60 222 100 206 140 218 C170 226 200 208 228 214"
        stroke="var(--matcha)" strokeWidth="2.2" strokeLinecap="round" fill="none"
        initial={{ pathLength: 0 }} animate={{ pathLength: hovered ? 1 : 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
      {/* Left edge vine — bottom to top */}
      <motion.path
        d="M28 212 C16 188 22 162 10 136 C0 112 14 88 8 60 C4 40 16 22 10 4"
        stroke="var(--matcha)" strokeWidth="2.2" strokeLinecap="round" fill="none"
        initial={{ pathLength: 0 }} animate={{ pathLength: hovered ? 1 : 0 }}
        transition={{ duration: 0.75, delay: 0.15, ease: "easeOut" }}
      />
      {/* Top edge vine — left to right */}
      <motion.path
        d="M10 28 C50 18 90 34 130 20 C160 10 196 28 228 20"
        stroke="var(--matcha)" strokeWidth="1.8" strokeLinecap="round" fill="none"
        initial={{ pathLength: 0 }} animate={{ pathLength: hovered ? 1 : 0 }}
        transition={{ duration: 0.65, delay: 0.35, ease: "easeOut" }}
      />
      {/* Right edge vine — top to bottom */}
      <motion.path
        d="M228 20 C240 44 234 70 246 96 C256 118 240 144 248 170 C254 190 242 208 228 214"
        stroke="var(--matcha)" strokeWidth="1.8" strokeLinecap="round" fill="none"
        initial={{ pathLength: 0 }} animate={{ pathLength: hovered ? 1 : 0 }}
        transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
      />
      {/* Leaves sprouting outward from all sides */}
      {[
        // Left side leaves (pointing left, outside card)
        { cx: 12, cy: 174, rx: 10, ry: 4.5, r: -35 },
        { cx: 6,  cy: 136, rx: 9,  ry: 4,   r: 25  },
        { cx: 14, cy: 96,  rx: 8,  ry: 3.5, r: -28 },
        { cx: 8,  cy: 54,  rx: 8,  ry: 3.5, r: 30  },
        // Right side leaves (pointing right)
        { cx: 244, cy: 60,  rx: 9,  ry: 4,   r: -28 },
        { cx: 252, cy: 100, rx: 10, ry: 4.5, r: 30  },
        { cx: 242, cy: 148, rx: 9,  ry: 4,   r: -25 },
        { cx: 248, cy: 192, rx: 8,  ry: 3.5, r: 28  },
        // Bottom leaves (pointing down)
        { cx: 68,  cy: 224, rx: 9,  ry: 4,   r: 85  },
        { cx: 148, cy: 228, rx: 10, ry: 4,   r: -88 },
        { cx: 208, cy: 222, rx: 8,  ry: 3.5, r: 82  },
        // Top leaves (pointing up)
        { cx: 52,  cy: 14,  rx: 8,  ry: 3.5, r: -88 },
        { cx: 128, cy: 8,   rx: 9,  ry: 4,   r: 90  },
        { cx: 196, cy: 12,  rx: 8,  ry: 3.5, r: -85 },
      ].map((l, i) => (
        <motion.ellipse key={i} cx={l.cx} cy={l.cy} rx={l.rx} ry={l.ry}
          fill="var(--matcha)" fillOpacity={0.6}
          style={{ rotate: `${l.r}deg` }}
          initial={{ scale: 0 }} animate={{ scale: hovered ? 1 : 0 }}
          transition={{ delay: 0.2 + i * 0.06, duration: 0.28, type: "spring", stiffness: 320 }}
        />
      ))}
      {/* Honey flowers at corners */}
      {[{ cx: 24, cy: 222 }, { cx: 8, cy: 24 }, { cx: 244, cy: 18 }, { cx: 250, cy: 218 }].map((f, i) => (
        <motion.circle key={i} cx={f.cx} cy={f.cy} r={4}
          fill="var(--honey)" fillOpacity={0.8}
          initial={{ scale: 0 }} animate={{ scale: hovered ? 1 : 0 }}
          transition={{ delay: 0.55 + i * 0.08, duration: 0.25, type: "spring", stiffness: 400 }}
        />
      ))}
    </svg>
  )
}

function CityOverlay({ hovered }: { hovered: boolean }) {
  // Buildings hang DOWN from the top of the overlay area (visible above the card top).
  // Card top is at y≈28. Buildings are positioned at the top and grow downward — tallest
  // ones descend below card top and are hidden by card background.
  // Each building has a slight skewX for an angled city feel.
  const buildings = [
    { x: 8,   w: 28, h: 70,  color: "var(--honey)",   delay: 0.00, skew: -3 },
    { x: 40,  w: 22, h: 90,  color: "var(--caramel)", delay: 0.06, skew:  4 },
    { x: 66,  w: 30, h: 60,  color: "var(--sky)",     delay: 0.03, skew: -2 },
    { x: 100, w: 24, h: 100, color: "var(--honey)",   delay: 0.10, skew:  5 },
    { x: 128, w: 26, h: 75,  color: "var(--caramel)", delay: 0.04, skew: -4 },
    { x: 158, w: 22, h: 88,  color: "var(--sky)",     delay: 0.08, skew:  3 },
    { x: 184, w: 26, h: 65,  color: "var(--honey)",   delay: 0.02, skew: -3 },
    { x: 214, w: 20, h: 82,  color: "var(--caramel)", delay: 0.07, skew:  4 },
  ]
  return (
    <svg width="100%" height="100%" viewBox="0 0 256 240" fill="none" overflow="visible">
      {buildings.map((b, i) => (
        <g key={i} style={{ transform: `skewX(${b.skew}deg)`, transformOrigin: `${b.x + b.w / 2}px 0px` }}>
          {/* Building body — anchored at y=0, grows downward */}
          <motion.rect
            x={b.x} y={0} width={b.w} height={b.h}
            fill={b.color} fillOpacity={0.22}
            style={{ transformOrigin: `${b.x + b.w / 2}px 0px` }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: hovered ? 1 : 0 }}
            transition={{ duration: 0.5, delay: b.delay, ease: [0.34, 1.56, 0.64, 1] }}
          />
          {/* Windows */}
          {[0, 1, 2].map(row => (
            <motion.rect key={row}
              x={b.x + 4} y={10 + row * 20} width={b.w - 10} height={8}
              fill={b.color} fillOpacity={0.6}
              initial={{ opacity: 0 }}
              animate={{ opacity: hovered ? 1 : 0 }}
              transition={{ delay: b.delay + 0.28 + row * 0.05, duration: 0.2 }}
            />
          ))}
        </g>
      ))}
    </svg>
  )
}

function ApathyOverlay({ hovered }: { hovered: boolean }) {
  // Around layer (z=2, inset=-28). Card at x:28→228, y:28→212 in viewBox 0 0 256 240.
  // ① Colorful squiggly vines animate INSIDE the card (over card, low opacity).
  // ② Particles fly out from card edges into the margins.
  const particles = [
    { x: 28,  y: 75,  vx: -62, vy: -18, color: "var(--rose)",    r: 5   },
    { x: 28,  y: 128, vx: -55, vy:  20, color: "var(--honey)",   r: 4   },
    { x: 28,  y: 178, vx: -50, vy: -35, color: "var(--sky)",     r: 3.5 },
    { x: 228, y: 72,  vx:  60, vy: -22, color: "var(--caramel)", r: 4.5 },
    { x: 228, y: 138, vx:  65, vy:  15, color: "var(--rose)",    r: 3.5 },
    { x: 228, y: 182, vx:  52, vy: -12, color: "var(--matcha)",  r: 4   },
    { x: 85,  y: 28,  vx: -20, vy: -72, color: "var(--honey)",   r: 4.5 },
    { x: 128, y: 28,  vx:   5, vy: -68, color: "var(--rose)",    r: 5   },
    { x: 175, y: 28,  vx:  28, vy: -65, color: "var(--sky)",     r: 3.5 },
    { x: 78,  y: 212, vx: -14, vy:  58, color: "var(--caramel)", r: 4   },
    { x: 148, y: 212, vx:  18, vy:  65, color: "var(--honey)",   r: 3.5 },
    { x: 205, y: 212, vx:  50, vy:  40, color: "var(--rose)",    r: 4   },
  ]
  return (
    <svg width="100%" height="100%" viewBox="0 0 256 240" fill="none" overflow="visible">
      {/* ── Squiggly vines INSIDE the card (x:40-216, y:60-195) ── */}
      {/* Vine 1 — rose, upper half */}
      <motion.path
        d="M48 78 C68 62 88 94 108 72 C128 50 148 86 168 64 C188 44 208 78 218 60"
        stroke="var(--rose)" strokeWidth="2" strokeLinecap="round" fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: hovered ? 1 : 0, opacity: hovered ? 0.28 : 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      />
      {/* Vine 2 — honey, mid */}
      <motion.path
        d="M40 118 C65 100 85 138 110 114 C135 90 155 132 182 108 C205 88 218 122 228 102"
        stroke="var(--honey)" strokeWidth="2.2" strokeLinecap="round" fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: hovered ? 1 : 0, opacity: hovered ? 0.32 : 0 }}
        transition={{ duration: 0.6, delay: 0.08, ease: "easeOut" }}
      />
      {/* Vine 3 — sky, lower mid */}
      <motion.path
        d="M50 155 C72 136 94 170 116 148 C138 126 160 164 184 142 C202 124 216 158 222 138"
        stroke="var(--sky)" strokeWidth="2" strokeLinecap="round" fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: hovered ? 1 : 0, opacity: hovered ? 0.3 : 0 }}
        transition={{ duration: 0.5, delay: 0.16, ease: "easeOut" }}
      />
      {/* Vine 4 — matcha, lower */}
      <motion.path
        d="M44 188 C70 170 96 198 124 178 C152 158 176 192 210 175"
        stroke="var(--matcha)" strokeWidth="1.8" strokeLinecap="round" fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: hovered ? 1 : 0, opacity: hovered ? 0.25 : 0 }}
        transition={{ duration: 0.45, delay: 0.22, ease: "easeOut" }}
      />

      {/* ── Particles bursting out from card edges ── */}
      {particles.map((p, i) => (
        <motion.circle key={i} cx={p.x} cy={p.y} r={p.r}
          fill={p.color}
          initial={{ opacity: 0 }}
          animate={hovered
            ? { cx: p.x + p.vx, cy: p.y + p.vy, opacity: [0, 0.85, 0], r: [p.r, p.r * 1.6, 0] }
            : { cx: p.x, cy: p.y, opacity: 0, r: p.r }}
          transition={{ duration: 0.75, delay: 0.1 + i * 0.04, ease: "easeOut",
            repeat: hovered ? Infinity : 0, repeatDelay: 0.5 }}
        />
      ))}
    </svg>
  )
}

function hexPath(r: number): string {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 6
    return `${r + r * Math.cos(a)} ${r + r * Math.sin(a)}`
  })
  return `M ${pts.join(" L ")} Z`
}

// Pre-compute hex paths for each size used in HiveOverlay so SSR and client
// always produce the exact same string (avoids hydration mismatch from
// floating-point differences between Node.js and the browser).
const HEX_PATHS: Record<number, string> = Object.fromEntries(
  [16, 18, 20, 22, 24].map(s => [s, hexPath(s / 2)])
)

function HiveOverlay({ hovered }: { hovered: boolean }) {
  // Hexagon confetti: each piece springs up then falls with gravity.
  // Uses motion.div so CSS transforms work cleanly (no SVG transform-origin issues).
  // The parent div has inset: -28 and overflow: visible.
  const pieces = [
    { left: "13%",  top: "27%",  size: 20, color: "var(--matcha)",  delay: 0.00 },
    { left: "30%",  top: "15%",  size: 16, color: "var(--honey)",   delay: 0.09 },
    { left: "46%",  top: "9%",   size: 24, color: "var(--sky)",     delay: 0.18 },
    { left: "64%",  top: "17%",  size: 18, color: "var(--rose)",    delay: 0.04 },
    { left: "80%",  top: "29%",  size: 22, color: "var(--caramel)", delay: 0.13 },
    { left: "16%",  top: "50%",  size: 18, color: "var(--honey)",   delay: 0.22 },
    { left: "77%",  top: "49%",  size: 20, color: "var(--matcha)",  delay: 0.03 },
    { left: "35%",  top: "64%",  size: 16, color: "var(--sky)",     delay: 0.24 },
    { left: "60%",  top: "61%",  size: 22, color: "var(--rose)",    delay: 0.08 },
    { left: "46%",  top: "72%",  size: 18, color: "var(--caramel)", delay: 0.15 },
    { left: "-1%",  top: "43%",  size: 16, color: "var(--matcha)",  delay: 0.19 },
    { left: "91%",  top: "42%",  size: 18, color: "var(--honey)",   delay: 0.02 },
  ]
  return (
    <div className="absolute inset-0" style={{ overflow: "visible", pointerEvents: "none" }}>
      {pieces.map((p, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
          initial={{ opacity: 0, scale: 0, y: 0 }}
          animate={hovered
            ? {
                opacity: [0, 0.80, 0.65, 0],
                scale:   [0, 1.4,  1.0,  0.55],
                y:       [0, -16,  6,    110],
              }
            : { opacity: 0, scale: 0, y: 0 }
          }
          transition={{
            duration: 0.9,
            delay: p.delay,
            repeat: hovered ? Infinity : 0,
            repeatDelay: 0.8,
            times: [0, 0.2, 0.42, 1],
            ease: ["backOut", "easeOut", "easeIn"],
          }}
        >
          <svg width={p.size} height={p.size} viewBox={`0 0 ${p.size} ${p.size}`} style={{ overflow: "visible" }}>
            <path d={HEX_PATHS[p.size]} fill={p.color} strokeWidth="0" />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}

function FoodOverlay({ hovered }: { hovered: boolean }) {
  // Forks and carrots float up from behind the card into the margins.
  // Behind layer (z=0) — card covers center, but items peek around edges.

  // Simple fork SVG path centered at (0,0), height ~22px
  const forkPath = "M-4,-11 L-4,-4 M4,-11 L4,-4 M0,-11 L0,-4 M-4,-4 C-4,-1 4,-1 4,-4 M0,-4 L0,11"

  const items: { cx: number; cy: number; type: "fork" | "carrot"; color: string; delay: number; dy: number; rotate: number }[] = [
    { cx: 8,   cy: 60,  type: "fork",   color: "var(--caramel)", delay: 0.00, dy: -20, rotate: -15 },
    { cx: 248, cy: 80,  type: "carrot", color: "var(--honey)",   delay: 0.06, dy: -18, rotate:  12 },
    { cx: 12,  cy: 160, type: "carrot", color: "var(--honey)",   delay: 0.10, dy: -22, rotate:  -8 },
    { cx: 244, cy: 150, type: "fork",   color: "var(--caramel)", delay: 0.04, dy: -16, rotate:  20 },
    { cx: 80,  cy: 6,   type: "fork",   color: "var(--caramel)", delay: 0.08, dy: -18, rotate:  -5 },
    { cx: 168, cy: 4,   type: "carrot", color: "var(--honey)",   delay: 0.02, dy: -20, rotate:  10 },
    { cx: 120, cy: 234, type: "fork",   color: "var(--caramel)", delay: 0.12, dy:  18, rotate: -10 },
    { cx: 60,  cy: 232, type: "carrot", color: "var(--honey)",   delay: 0.07, dy:  16, rotate:   8 },
    { cx: 200, cy: 236, type: "fork",   color: "var(--caramel)", delay: 0.05, dy:  20, rotate: -12 },
  ]

  return (
    <svg width="100%" height="100%" viewBox="0 0 256 240" fill="none" overflow="visible">
      {items.map((item, i) => (
        <motion.g
          key={i}
          style={{ transformOrigin: `${item.cx}px ${item.cy}px` }}
          initial={{ opacity: 0, y: 0 }}
          animate={hovered
            ? { opacity: [0, 0.7, 0.5], y: [0, item.dy, item.dy * 0.8], rotate: [item.rotate * 0.5, item.rotate, item.rotate * 0.8] }
            : { opacity: 0, y: 0, rotate: 0 }
          }
          transition={{
            duration: 1.8,
            delay: item.delay,
            repeat: hovered ? Infinity : 0,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        >
          {item.type === "fork" ? (
            <g transform={`translate(${item.cx},${item.cy})`}>
              <path d={forkPath} stroke={item.color} strokeWidth="2" strokeLinecap="round" fill="none" />
            </g>
          ) : (
            <g transform={`translate(${item.cx},${item.cy})`}>
              {/* Carrot body */}
              <path d="M-6,-12 L0,10 L6,-12 Z" fill="var(--honey)" fillOpacity={0.8} />
              {/* Carrot top (greens) */}
              <path d="M-2,-12 C-5,-20 -1,-22 0,-16 C1,-22 5,-20 2,-12" fill="var(--matcha)" fillOpacity={0.9} />
            </g>
          )}
        </motion.g>
      ))}
    </svg>
  )
}

/* ── Curved arrow between sections ── */
function CurvedArrow({
  color, delay = 0, flip = false, className = "",
}: { color: string; delay?: number; flip?: boolean; className?: string }) {
  return (
    <div className={cn("pointer-events-none", flip && "-scale-x-100", className)} aria-hidden="true">
      <svg width="56" height="72" viewBox="0 0 56 72" fill="none">
        <motion.path
          d="M 44 4 C 52 18 52 38 36 52 C 26 60 14 64 10 70"
          stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.65 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ delay, duration: 0.9, ease: "easeOut" }}
        />
        <motion.path
          d="M 10 70 L 6 58 M 10 70 L 22 67"
          stroke={color} strokeWidth="2.5" strokeLinecap="round"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.65 }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.85, duration: 0.2 }}
        />
      </svg>
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
function FeaturedCard({ opportunity, index }: { opportunity: (typeof mockOpportunities)[number]; index: number }) {
  const catConfig: Record<string, { emoji: string; accent: string; bgCard: string; tagBg: string; tagText: string; strip: string }> = {
    Environment:     { emoji: "🌿", accent: "var(--matcha)",   bgCard: "bg-matcha/8",   tagBg: "bg-matcha/15",   tagText: "text-matcha-dark", strip: "bg-matcha/20"   },
    Food:            { emoji: "🥕", accent: "var(--honey)",    bgCard: "bg-honey/8",    tagBg: "bg-honey/18",    tagText: "text-espresso/70", strip: "bg-honey/25"    },
    Education:       { emoji: "✦",  accent: "var(--sky)",      bgCard: "bg-sky/8",      tagBg: "bg-sky/15",      tagText: "text-espresso/70", strip: "bg-sky/20"      },
    Community:       { emoji: "🏘️", accent: "var(--caramel)", bgCard: "bg-caramel/8",  tagBg: "bg-caramel/18",  tagText: "text-espresso/70", strip: "bg-caramel/20"  },
    "Arts & Culture":{ emoji: "🎨", accent: "var(--rose)",     bgCard: "bg-rose/8",     tagBg: "bg-rose/15",     tagText: "text-rose",        strip: "bg-rose/20"     },
  }
  const c = catConfig[opportunity.category] ?? { emoji: "✦", accent: "var(--honey)", bgCard: "", tagBg: "bg-muted", tagText: "text-muted-foreground", strip: "bg-muted/40" }
  const spotsPercent = Math.round((opportunity.spotsLeft / opportunity.totalSpots) * 100)
  const delays = [0, 0.08, 0.16]

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: delays[index] ?? 0, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -6 }}
      className="h-full"
    >
      <Card className={cn(cardClass, "group h-full overflow-hidden border transition-shadow hover:shadow-lg hover:shadow-espresso/[0.08]", c.bgCard)}>
        {/* Coloured top strip with emoji + org */}
        <div className={cn("flex items-center gap-3 px-5 py-3 border-b border-border/40", c.strip)}>
          <span className="text-2xl leading-none select-none">{c.emoji}</span>
          <div className="min-w-0">
            <p className="font-serif text-xs italic text-espresso/55 truncate">{opportunity.organization}</p>
          </div>
          {opportunity.urgent && (
            <Badge className="ml-auto shrink-0 rounded-full border-none bg-destructive/12 text-destructive text-[10px] font-semibold px-2 py-0.5">
              <Zap className="mr-0.5 h-2.5 w-2.5" /> Urgent
            </Badge>
          )}
        </div>

        <CardContent className="flex flex-col gap-3 p-5 pt-4">
          <h3 className="font-display text-base leading-snug text-espresso tracking-wide">{opportunity.title}</h3>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {opportunity.tags.slice(0, 3).map(tag => (
              <span key={tag} className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-medium", c.tagBg, c.tagText)}>
                {tag}
              </span>
            ))}
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-3 font-serif text-xs italic text-espresso/45">
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {opportunity.location.split(",")[0]}</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {opportunity.timeCommitment}</span>
          </div>

          {/* Spots bar */}
          <div className="mt-auto pt-3 border-t border-border/35">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-serif text-xs italic text-espresso/45">{opportunity.spotsLeft} spots left</span>
              <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: c.accent }}>
                <Star className="h-3 w-3" style={{ fill: c.accent }} /> {opportunity.xpReward} XP
              </div>
            </div>
            <div className="h-1.5 rounded-full bg-espresso/8 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: c.accent, opacity: 0.6 }}
                initial={{ width: 0 }}
                whileInView={{ width: `${100 - spotsPercent}%` }}
                viewport={{ once: true }}
                transition={{ delay: (delays[index] ?? 0) + 0.3, duration: 0.7, ease: "easeOut" }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}


/* ── Feedback Form (used inside MailFeedback modal) ── */
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

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 py-4 overflow-hidden">
        <motion.div
          initial={{ x: 0, y: 0, rotate: -10, opacity: 1, scale: 1 }}
          animate={{ x: 80, y: -60, rotate: 30, opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
          className="text-3xl select-none"
        >
          ✉️
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="flex flex-col items-center gap-1"
        >
          <p className="font-semibold text-sm text-espresso">Message sent!</p>
          <p className="font-serif text-xs italic text-espresso/50">We read every single one. ✦</p>
        </motion.div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <p className="font-serif text-xs text-espresso/50 italic">
        Have an idea, a question, or something that bugged you? We read every message.
      </p>
      <Textarea
        placeholder="What would make Something better for you?"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="rounded-xl border-border/60 bg-latte/30 font-serif text-sm min-h-[100px] resize-none"
        disabled={status === "loading"}
      />
      <ScaleOnTap className="self-end">
        <Button type="submit" disabled={status === "loading" || !message.trim()} className="rounded-full bg-honey text-espresso hover:bg-honey/85 font-semibold text-sm px-5">
          {status === "loading" ? "Sending..." : "Send ✦"}
        </Button>
      </ScaleOnTap>
      <AnimatePresence>
        {status === "error" && (
          <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="font-serif text-xs italic text-destructive">
            Something went wrong. Try again?
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  )
}

/* ── Mail Feedback Component ── */
function MailFeedback() {
  const [isHovered, setIsHovered] = React.useState(false)
  const [modalOpen, setModalOpen] = React.useState(false)
  const [isTouch, setIsTouch] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.65 })

  React.useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches)
  }, [])

  // Desktop: hover only. Mobile/touch: scroll into view.
  const isEnvelopeOpen = modalOpen || isHovered || (isTouch && isInView)

  return (
    <div ref={ref} className="flex flex-col items-center justify-center gap-4">
      <motion.div
        className="cursor-pointer select-none"
        onHoverStart={() => !isTouch && setIsHovered(true)}
        onHoverEnd={() => !isTouch && !modalOpen && setIsHovered(false)}
        onClick={() => { setIsHovered(true); setModalOpen(true) }}
        whileTap={{ scale: 0.96 }}
        role="button"
        aria-label="Open feedback form"
      >
        {/* Envelope */}
        <div className="relative" style={{ width: 260, height: 195 }}>
          <svg width="260" height="195" viewBox="0 0 260 195" fill="none">
            {/* Drop shadow */}
            <rect x="14" y="98" width="232" height="90" rx="9" fill="var(--espresso)" fillOpacity="0.05" />

            {/* Paper — starts fully inside envelope (top at y=100, below envelope edge at y=92) */}
            {/* Only visible when open (slides up out of envelope) */}
            <motion.g
              animate={{ y: isEnvelopeOpen ? -82 : 0 }}
              transition={{ type: "spring", stiffness: 160, damping: 20 }}
            >
              <rect x="60" y="100" width="140" height="130" rx="5" fill="white" stroke="var(--honey)" strokeWidth="1.5" />
              <line x1="78" y1="125" x2="182" y2="125" stroke="var(--espresso)" strokeOpacity="0.11" strokeWidth="1.2" />
              <line x1="78" y1="140" x2="182" y2="140" stroke="var(--espresso)" strokeOpacity="0.11" strokeWidth="1.2" />
              <line x1="78" y1="155" x2="162" y2="155" stroke="var(--espresso)" strokeOpacity="0.08" strokeWidth="1.2" />
              <motion.text x="130" y="178" fontSize="13" textAnchor="middle"
                animate={{ opacity: isEnvelopeOpen ? 0.5 : 0 }}
                transition={{ delay: isEnvelopeOpen ? 0.3 : 0 }}>
                ✦
              </motion.text>
            </motion.g>

            {/* Envelope body — drawn on top of paper to hide it when closed */}
            <rect x="12" y="92" width="236" height="98" rx="9" fill="var(--latte)" stroke="var(--caramel)" strokeWidth="1.8" fillOpacity="0.96" />

            {/* Fold lines */}
            <line x1="12" y1="92" x2="130" y2="158" stroke="var(--caramel)" strokeWidth="1.2" strokeOpacity="0.28" />
            <line x1="248" y1="92" x2="130" y2="158" stroke="var(--caramel)" strokeWidth="1.2" strokeOpacity="0.28" />

            {/* Flap — morphs from closed (V pointing down into envelope) to open (V pointing up) */}
            {/* Becomes transparent when open so paper is fully visible */}
            <motion.path
              fill="var(--latte)"
              stroke="var(--caramel)"
              strokeWidth="1.8"
              animate={{
                d: isEnvelopeOpen
                  ? "M 12 92 L 130 26 L 248 92"
                  : "M 12 92 L 130 158 L 248 92",
                fillOpacity: isEnvelopeOpen ? 0 : 0.95,
              }}
              transition={{ type: "spring", stiffness: 130, damping: 20 }}
            />
          </svg>
        </div>

        {/* Label */}
        <AnimatePresence mode="wait">
          <motion.p
            key={isEnvelopeOpen ? "open" : "closed"}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="text-center font-serif text-sm italic text-espresso/50 mt-1"
          >
            {isEnvelopeOpen ? "Click to share a thought ✦" : "Have something to say?"}
          </motion.p>
        </AnimatePresence>
      </motion.div>

      {/* Feedback Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setModalOpen(false); setIsHovered(false) }}
          >
            <div className="absolute inset-0 bg-espresso/20 backdrop-blur-sm" />
            <motion.div
              className="relative z-10 w-full max-w-md"
              initial={{ scale: 0.88, y: 24, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.88, y: 24, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card className={cn(cardClass, "overflow-hidden border-l-[3px] border-l-honey/50 shadow-xl")}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Send className="h-4 w-4 text-honey" />
                      <h3 className="text-sm font-semibold text-espresso">Share a thought</h3>
                    </div>
                    <motion.button
                      onClick={() => { setModalOpen(false); setIsHovered(false) }}
                      className="text-espresso/40 hover:text-espresso/70 transition-colors"
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M2 2 L14 14 M14 2 L2 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </motion.button>
                  </div>
                  <FeedbackForm />
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
