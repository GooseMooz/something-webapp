"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { ArrowRight, Sparkles, Heart, TrendingUp, MapPin, Clock, Zap, Star, Leaf, UtensilsCrossed, Landmark, Trophy, CalendarHeart, BookOpen, Users, CheckCircle2, ArrowUpRight, Shield, ClipboardList, MessageSquare, Share2, Megaphone } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Footer } from "@/components/footer"
import {
  FadeIn,
  SlideUp,
  StaggerChildren,
  StaggerItem,
  ScaleOnTap,
  FloatingParticles,
  MorphBlob,
  AnimatedCounter,
  WavyText,
  Shimmer,
} from "@/components/motion-wrapper"
import { mockOpportunities } from "@/lib/mock-data"
import { cn } from "@/lib/utils"


const cardClass = "border-border/60 bg-card shadow-sm shadow-espresso/[0.03]"

export default function HomePage() {
  const featured = mockOpportunities.filter((op) => op.featured).slice(0, 4)

  return (
    <div className="min-h-screen bg-background">
      {/* Marketing Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/80 backdrop-blur-xl"
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-matcha text-espresso">
              <Sparkles className="h-5 w-5 transition-transform group-hover:rotate-12" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-espresso">Something</span>
          </Link>
          <div className="hidden items-center gap-2 sm:flex">
            <Link href="/our-story">
              <Button variant="ghost" className="rounded-full text-sm font-semibold text-espresso/50 hover:text-espresso">
                Our Story
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="rounded-full border-border/60 text-sm font-semibold text-espresso/70 hover:text-espresso">
                Log In
              </Button>
            </Link>
            <ScaleOnTap>
              <Link href="/signup">
                <Button className="rounded-full bg-espresso text-card hover:bg-espresso/90 text-sm font-bold">
                  Join the Movement
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </Link>
            </ScaleOnTap>
          </div>
          <div className="flex items-center gap-2 sm:hidden">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="rounded-full text-sm font-semibold text-espresso/60">Log In</Button>
            </Link>
            <ScaleOnTap>
              <Link href="/signup">
                <Button size="sm" className="rounded-full bg-espresso text-card hover:bg-espresso/90 text-sm font-bold">Join</Button>
              </Link>
            </ScaleOnTap>
          </div>
        </nav>
      </motion.header>

      {/* ── HERO ─── */}
      <section className="relative overflow-hidden px-4 pb-20 pt-16 md:px-6 md:pb-32 md:pt-24">
        <FloatingParticles count={30} className="opacity-60" />
        <MorphBlob className="right-[-10%] top-[-10%] h-[500px] w-[500px]" color="var(--matcha)" />
        <MorphBlob className="bottom-[-20%] left-[-10%] h-[400px] w-[400px]" color="var(--sky)" />

        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center">
            <FadeIn delay={0.1}>
              <Badge className="mb-6 rounded-full border-matcha/30 bg-matcha/10 px-5 py-2 text-sm font-semibold text-matcha-dark">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                Not just another platform. A movement.
              </Badge>
            </FadeIn>

            <FadeIn delay={0.2}>
              <h1 className="max-w-4xl text-5xl font-extrabold leading-[1.1] tracking-tight text-espresso md:text-7xl text-balance">
                Do{" "}
                <span className="relative inline-block">
                  <WavyText text="Something" className="text-matcha-dark" delay={0.5} />
                  <motion.svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}>
                    <motion.path d="M2 8C50 3 100 2 150 5C200 8 250 4 298 6" stroke="var(--matcha)" strokeWidth="4" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }} />
                  </motion.svg>
                </span>
                <br />
                That Matters
              </h1>
            </FadeIn>

            <FadeIn delay={0.4}>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-espresso/55 md:text-xl text-pretty">
                {"We're building a new way to show up for your community. Peer-driven, relationship-first volunteering that connects you with the land, your neighbours, and the causes that actually matter to you."}
              </p>
            </FadeIn>

            <FadeIn delay={0.55}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <ScaleOnTap>
                  <Link href="/signup">
                    <Shimmer>
                      <Button size="lg" className="rounded-full bg-matcha px-9 py-6 text-base font-bold text-espresso hover:bg-matcha-dark">
                        Join the Pilot
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Shimmer>
                  </Link>
                </ScaleOnTap>
                <ScaleOnTap>
                  <Link href="/signup">
                    <Button variant="outline" size="lg" className="rounded-full border-espresso/15 px-9 py-6 text-base font-bold text-espresso hover:bg-espresso/5">
                      {"I'm an Organization"}
                    </Button>
                  </Link>
                </ScaleOnTap>
              </div>
            </FadeIn>

            <FadeIn delay={0.7}>
              <div className="mt-12 flex items-center gap-3 rounded-full bg-card/80 px-5 py-2.5 shadow-sm backdrop-blur-sm border border-border/40">
                <div className="flex -space-x-2">
                  {["bg-matcha/30", "bg-sky/30", "bg-caramel/30", "bg-honey/30", "bg-rose/20"].map((bg, i) => (
                    <motion.div key={i} initial={{ scale: 0, x: -10 }} animate={{ scale: 1, x: 0 }} transition={{ delay: 0.8 + i * 0.08, type: "spring", stiffness: 400 }} className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-card text-xs font-bold text-espresso/50 ${bg}`}>
                      {String.fromCharCode(64 + i + 1)}
                    </motion.div>
                  ))}
                </div>
                <p className="text-sm text-espresso/50">
                  <span className="font-bold text-espresso">2,400+</span> youth already in the movement
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── PILOT PROJECT OVERVIEW ─── */}
      <section className="relative px-4 py-16 md:px-6 md:py-24 bg-latte/40">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <SlideUp>
              <div>
                <Badge className="mb-4 rounded-full border-sky/30 bg-sky/10 px-4 py-1.5 text-xs font-semibold text-sky-dark">
                  Active Pilot
                </Badge>
                <h2 className="text-3xl font-extrabold text-espresso md:text-4xl text-balance mb-4">
                  {"This isn't finished and YOU can change that."}
                </h2>
                <p className="text-sm text-espresso/50 leading-relaxed mb-3">
                  {"Something is a live pilot. We want this platform to be co-creative: your feedback shapes every feature, every flow, every decision."}
                </p>
                <p className="text-sm text-espresso/50 leading-relaxed mb-6">
                  {"Right now we're focused on Metro Vancouver, connecting youth volunteers with environmental, civic, and food organizations. We're tiny and growing with intention."}
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <ScaleOnTap>
                    <Link href="/our-story">
                      <Button variant="outline" className="rounded-full border-border/60 text-sm font-bold text-espresso hover:bg-espresso/5">
                        Read Our Background
                        <ArrowRight className="ml-1.5 h-4 w-4" />
                      </Button>
                    </Link>
                  </ScaleOnTap>
                </div>
              </div>
            </SlideUp>

            <SlideUp delay={0.1}>
              <Card className={cn(cardClass, "overflow-hidden")}>
                <div className="h-2 bg-gradient-to-r from-matcha/40 via-sky/30 to-honey/30" />
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-matcha/10 shrink-0">
                      <Image src="/images/cathy-luo.jpg" alt="Cathy Luo, founder of Something" fill className="object-cover" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-espresso">Cathy Luo</h3>
                      <p className="text-xs text-espresso/40">Founder & Lead, Something</p>
                    </div>
                  </div>
                  <p className="text-sm text-espresso/50 leading-relaxed italic">
                    {"\"I built Something because I was tired of volunteering feeling like a chore. It should feel like showing up for your people -- because that's exactly what it is. We're not here to make volunteering corporate. We're here to make it personal.\""}
                  </p>
                </CardContent>
              </Card>
            </SlideUp>
          </div>
        </div>
      </section>

      {/* ── FOCUS AREAS ─── */}
      <section className="px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SlideUp>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-espresso md:text-4xl text-balance mb-3">
                Where we focus (for now)
              </h2>
              <p className="text-sm text-espresso/45 max-w-md mx-auto">
                {"We're starting small and deep -- three categories where Metro Vancouver youth can make the biggest impact right now."}
              </p>
            </div>
          </SlideUp>
          <StaggerChildren className="grid gap-5 md:grid-cols-3">
            {[
              { icon: Leaf, title: "Environmental", description: "Beach cleanups, trail restoration, community gardens, and climate action. Get your hands in the dirt.", color: "bg-matcha/12 text-matcha-dark", accent: "from-matcha/15 to-matcha/5" },
              { icon: Landmark, title: "Civic & Community", description: "Newcomer welcome events, senior socials, neighbourhood building. The kind of volunteering that builds real relationships.", color: "bg-sky/12 text-sky-dark", accent: "from-sky/15 to-sky/5" },
              { icon: UtensilsCrossed, title: "Food & Agriculture", description: "Food bank sorting, community kitchen prep, urban farming. Nourish your community, literally.", color: "bg-honey/12 text-espresso/70", accent: "from-honey/15 to-honey/5" },
            ].map((area, i) => (
              <StaggerItem key={area.title}>
                <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Card className={cn(cardClass, "h-full relative overflow-hidden")}>
                    <div className={cn("absolute inset-x-0 top-0 h-1 bg-gradient-to-r", area.accent)} />
                    <CardContent className="p-6 pt-7 flex flex-col gap-4">
                      <div className={cn("flex h-14 w-14 items-center justify-center rounded-2xl", area.color)}>
                        <area.icon className="h-7 w-7" />
                      </div>
                      <h3 className="text-lg font-bold text-espresso">{area.title}</h3>
                      <p className="text-sm text-espresso/45 leading-relaxed">{area.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ── FEATURED OPPORTUNITIES ─── */}
      <section className="relative px-4 py-16 md:px-6 md:py-24 bg-latte/30">
        <div className="relative z-10 mx-auto max-w-6xl">
          <SlideUp>
            <div className="mb-12 flex flex-col items-center text-center">
              <Badge className="mb-4 rounded-full border-sky/30 bg-sky/10 px-5 py-2 text-sm font-semibold text-sky-dark">
                <Zap className="mr-1.5 h-3.5 w-3.5" />
                Happening Soon
              </Badge>
              <h2 className="text-3xl font-extrabold text-espresso md:text-4xl text-balance">
                Opportunities waiting for you
              </h2>
              <p className="mt-3 max-w-lg text-sm text-espresso/45">
                {"Real gigs from real orgs. Click, show up, make an impact."}
              </p>
            </div>
          </SlideUp>

          <StaggerChildren className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((op) => (
              <StaggerItem key={op.id}><FeaturedCard opportunity={op} /></StaggerItem>
            ))}
          </StaggerChildren>

          <SlideUp delay={0.3}>
            <div className="mt-12 flex justify-center">
              <ScaleOnTap>
                <Link href="/opportunities">
                  <Button variant="outline" size="lg" className="rounded-full border-border px-9 py-6 font-bold text-espresso hover:bg-latte">
                    Browse All Opportunities <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </ScaleOnTap>
            </div>
          </SlideUp>
        </div>
      </section>

      {/* ── WHY GAMIFIED / XP SYSTEM ─── */}
      <section className="px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <SlideUp>
              <div>
                <Badge className="mb-4 rounded-full border-honey/30 bg-honey/10 px-4 py-1.5 text-xs font-semibold text-espresso/70">
                  <Trophy className="mr-1.5 h-3 w-3" />
                  The XP System
                </Badge>
                <h2 className="text-3xl font-extrabold text-espresso md:text-4xl text-balance mb-4">
                  {"Why we gamified volunteering (and why it works)"}
                </h2>
                <p className="text-sm text-espresso/50 leading-relaxed mb-4">
                  {"Let's be honest -- traditional volunteer tracking is boring. Hours on a spreadsheet don't capture how it felt to plant your first tree or teach someone to code."}
                </p>
                <p className="text-sm text-espresso/50 leading-relaxed mb-6">
                  {"XP isn't just points. It's a reflection of your journey. The more you show up, the more you unlock: exclusive events, leadership roles, recommendation letters, and bragging rights on the leaderboard."}
                </p>
                <div className="flex flex-col gap-3 text-sm">
                  {[
                    "Earn XP for every hour you volunteer",
                    "Unlock badges that tell your impact story",
                    "Top-level volunteers get access to exclusive events",
                    "Build a real portfolio for jobs and school apps",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2.5 text-espresso/55">
                      <CheckCircle2 className="h-4 w-4 text-matcha-dark shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </SlideUp>

            <SlideUp delay={0.1}>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Earn XP", value: "150+", sub: "per session", icon: Star, bg: "bg-matcha/10", text: "text-matcha-dark" },
                  { label: "Badges", value: "25+", sub: "to unlock", icon: Trophy, bg: "bg-honey/10", text: "text-espresso/70" },
                  { label: "Levels", value: "10", sub: "to climb", icon: TrendingUp, bg: "bg-sky/10", text: "text-sky-dark" },
                  { label: "Perks", value: "VIP", sub: "events & recs", icon: CalendarHeart, bg: "bg-rose/10", text: "text-rose" },
                ].map((stat) => (
                  <motion.div key={stat.label} whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Card className={cn(cardClass, "h-full")}>
                      <CardContent className="p-5 flex flex-col items-center text-center gap-2">
                        <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", stat.bg, stat.text)}>
                          <stat.icon className="h-6 w-6" />
                        </div>
                        <p className="text-2xl font-extrabold text-espresso">{stat.value}</p>
                        <p className="text-xs font-semibold text-espresso/35">{stat.sub}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </SlideUp>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─── */}
      <section className="relative bg-latte/40 px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SlideUp>
            <div className="mb-14 text-center">
              <h2 className="text-3xl font-extrabold text-espresso md:text-4xl text-balance">How it works</h2>
              <p className="mt-3 text-sm text-espresso/45">Three steps. Five minutes. Real impact.</p>
            </div>
          </SlideUp>

          <div className="grid gap-6 md:grid-cols-3 mb-8">
            {[
              { step: "01", title: "Create your profile", description: "Tell us your skills, your vibes, and the causes you care about. Takes 3 minutes, tops.", icon: Sparkles, color: "bg-matcha/15 text-matcha-dark" },
              { step: "02", title: "Browse & apply", description: "Find opps matched to your interests. One-tap apply -- no cover letters, no stress.", icon: MapPin, color: "bg-sky/15 text-sky-dark" },
              { step: "03", title: "Show up & level up", description: "Volunteer, earn XP, unlock badges, and build a portfolio that proves your impact.", icon: TrendingUp, color: "bg-honey/15 text-espresso/70" },
            ].map((step, i) => (
              <SlideUp key={step.step} delay={i * 0.12}>
                <motion.div whileHover={{ y: -6 }} className="h-full">
                  <Card className={cn(cardClass, "relative overflow-hidden h-full")}>
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-matcha/20 via-sky/15 to-honey/15" />
                    <CardContent className="flex flex-col gap-4 p-6 pt-7">
                      <div className="flex items-center gap-3">
                        <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl", step.color)}>
                          <step.icon className="h-6 w-6" />
                        </div>
                        <span className="text-3xl font-extrabold text-espresso/8">{step.step}</span>
                      </div>
                      <h3 className="text-lg font-bold text-espresso">{step.title}</h3>
                      <p className="text-sm leading-relaxed text-espresso/50">{step.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </SlideUp>
            ))}
          </div>

          {/* Important note */}
          <SlideUp delay={0.3}>
            <Card className={cn(cardClass, "max-w-2xl mx-auto")}>
              <CardContent className="p-5 flex items-start gap-3">
                <Shield className="h-5 w-5 text-sky-dark shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-espresso mb-1">A quick note</p>
                  <p className="text-xs text-espresso/45 leading-relaxed">
                    {"Volunteering through Something connects you with opportunities, but it doesn't make you an official member of the host organization. If you want to join an org long-term, you'd apply through their own process -- we'll point you in the right direction."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </SlideUp>
        </div>
      </section>

      {/* ── BENEFITS FOR ORGANIZATIONS ─── */}
      <section className="px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SlideUp>
            <div className="text-center mb-12">
              <Badge className="mb-4 rounded-full border-caramel/30 bg-caramel/10 px-4 py-1.5 text-xs font-semibold text-espresso/70">
                For Organizations
              </Badge>
              <h2 className="text-3xl font-extrabold text-espresso md:text-4xl text-balance mb-3">
                {"We bring the volunteers. You bring the mission."}
              </h2>
              <p className="text-sm text-espresso/45 max-w-lg mx-auto">
                {"Stop chasing volunteers through email chains. Post opportunities, review applicants, and track impact -- all in one place."}
              </p>
            </div>
          </SlideUp>

          <StaggerChildren className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Less admin, more impact", description: "We screen and pre-orient youth, do basic matching, and handle check-ins so your staff spend less time managing volunteers.", icon: ClipboardList, accent: "bg-matcha/10 text-matcha-dark" },
              { title: "Easy hour & impact tracking", description: "We track attendance, hours, and skills, then turn them into simple metrics and stories for your grants and reports.", icon: TrendingUp, accent: "bg-sky/10 text-sky-dark" },
              { title: "Faster communication", description: "Share one clear task and we coordinate with youth, keeping you in the loop only when needed. No more long email threads.", icon: MessageSquare, accent: "bg-honey/10 text-espresso/70" },
              { title: "Shared infrastructure", description: "Tap into a centralized, youth-friendly system with common forms, expectations, and privacy practices -- no DIY needed.", icon: Share2, accent: "bg-caramel/10 text-espresso/60" },
              { title: "Reach green-career youth", description: "We promote your tasks to youth curious about climate and community work who see your org as part of their long-term path.", icon: Megaphone, accent: "bg-matcha/10 text-matcha-dark" },
            ].map((benefit) => (
              <StaggerItem key={benefit.title}>
                <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Card className={cn(cardClass, "h-full")}>
                    <CardContent className="p-5 flex flex-col gap-3">
                      <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", benefit.accent)}>
                        <benefit.icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-sm font-bold text-espresso">{benefit.title}</h3>
                      <p className="text-xs text-espresso/45 leading-relaxed">{benefit.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ── VISION / WHAT'S NEXT ─── */}
      <section className="px-4 py-16 md:px-6 md:py-24 bg-latte/40">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-2 items-start">
            <SlideUp>
              <Badge className="mb-4 rounded-full border-matcha/30 bg-matcha/10 px-4 py-1.5 text-xs font-semibold text-matcha-dark">
                The Vision
              </Badge>
              <h2 className="text-3xl font-extrabold text-espresso md:text-4xl text-balance mb-4">
                {"What we're planning next"}
              </h2>
              <p className="text-sm text-espresso/50 leading-relaxed mb-6">
                {"Something is just getting started. Here's what's on the horizon -- shaped by you, built for you."}
              </p>
            </SlideUp>

            <SlideUp delay={0.1}>
              <div className="flex flex-col gap-3">
                {[
                  { title: "Climate Cafes", description: "Casual pop-up events where youth talk climate action over drinks. Think meetup, not lecture.", icon: CalendarHeart, tag: "Events" },
                  { title: "Fun volunteer socials", description: "Movie nights, game tournaments, and potlucks for our top volunteers. Community should feel like friendship.", icon: Heart, tag: "Community" },
                  { title: "Educational resources", description: "Curated guides, workshops, and certifications to help you grow your skills while you give back.", icon: BookOpen, tag: "Learning" },
                  { title: "Community resource hub", description: "A shared space for local resources -- mental health support, food resources, civic guides, and more.", icon: Users, tag: "Resources" },
                ].map((item, i) => (
                  <motion.div key={item.title} whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Card className={cn(cardClass, "overflow-hidden")}>
                      <CardContent className="p-4 flex items-start gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky/10 text-sky-dark shrink-0">
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-bold text-espresso">{item.title}</h3>
                            <Badge className="rounded-full border-none bg-espresso/6 text-espresso/40 text-[10px] font-semibold">{item.tag}</Badge>
                          </div>
                          <p className="text-xs text-espresso/45 leading-relaxed">{item.description}</p>
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

      {/* ── COLLABORATION CAROUSEL ─── */}
      <section className="px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SlideUp>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold text-espresso md:text-4xl text-balance mb-3">
                Our community partners
              </h2>
              <p className="text-sm text-espresso/45 max-w-md mx-auto">
                {"The orgs making it possible. We're proud to work alongside these incredible organizations."}
              </p>
            </div>
          </SlideUp>

          <CollaborationCarousel />
        </div>
      </section>

      {/* ── IMPACT STATS ─── */}
      <section className="relative overflow-hidden px-4 py-16 md:px-6 md:py-24 bg-latte/30">
        <div className="relative z-10 mx-auto max-w-6xl">
          <SlideUp>
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-extrabold text-espresso md:text-4xl text-balance">Our collective impact</h2>
              <p className="mt-3 text-sm text-espresso/45">Real numbers from real youth making real change.</p>
            </div>
          </SlideUp>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
            {[
              { value: 2400, suffix: "+", label: "Active Volunteers" },
              { value: 15000, suffix: "+", label: "Hours Logged" },
              { value: 180, suffix: "+", label: "Partner Orgs" },
              { value: 340, suffix: "+", label: "Opportunities" },
            ].map((stat, i) => (
              <SlideUp key={stat.label} delay={i * 0.08}>
                <Card className={cn(cardClass, "text-center")}>
                  <CardContent className="p-6">
                    <p className="text-3xl font-extrabold text-espresso md:text-4xl">
                      <AnimatedCounter target={stat.value} suffix={stat.suffix} duration={2.5} />
                    </p>
                    <p className="mt-1.5 text-xs font-semibold text-espresso/35">{stat.label}</p>
                  </CardContent>
                </Card>
              </SlideUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─── */}
      <section className="px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-4xl">
          <SlideUp>
            <Card className="relative overflow-hidden border-none bg-espresso">
              <FloatingParticles count={15} className="opacity-40" colors={["rgba(126,200,160,0.4)", "rgba(139,184,224,0.3)", "rgba(232,184,109,0.3)"]} />
              <CardContent className="relative z-10 flex flex-col items-center gap-7 p-10 text-center md:p-16">
                <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="flex h-16 w-16 items-center justify-center rounded-2xl bg-matcha/20">
                  <Heart className="h-8 w-8 text-matcha" />
                </motion.div>
                <h2 className="text-3xl font-extrabold text-cream md:text-5xl text-balance">
                  {"Ready to do Something?"}
                </h2>
                <p className="max-w-lg text-base text-cream/55 leading-relaxed md:text-lg text-pretty">
                  {"This is bigger than volunteering. It's about showing up for your community in a way that actually feels good. Join the movement."}
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <ScaleOnTap>
                    <Link href="/signup">
                      <Shimmer>
                        <Button size="lg" className="rounded-full bg-matcha px-9 py-6 text-base font-bold text-espresso hover:bg-matcha-dark">
                          Join the Pilot <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Shimmer>
                    </Link>
                  </ScaleOnTap>
                  <ScaleOnTap>
                    <Link href="/opportunities">
                      <Button variant="outline" size="lg" className="rounded-full border-cream/20 px-9 py-6 text-base font-bold text-cream hover:bg-cream/10">
                        Browse First
                      </Button>
                    </Link>
                  </ScaleOnTap>
                </div>
              </CardContent>
            </Card>
          </SlideUp>
        </div>
      </section>

      <Footer />
    </div>
  )
}

/* ── Featured Card ─── */
function FeaturedCard({ opportunity }: { opportunity: (typeof mockOpportunities)[number] }) {
  const categoryColors: Record<string, string> = {
    Environment: "bg-matcha/20 text-matcha-dark",
    Education: "bg-sky/20 text-sky-dark",
    Community: "bg-caramel/20 text-espresso/70",
    "Arts & Culture": "bg-honey/20 text-espresso/70",
  }
  return (
    <ScaleOnTap className="w-full">
      <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300 }} className="h-full">
        <Card className={cn(cardClass, "group h-full overflow-hidden transition-shadow hover:shadow-md hover:shadow-espresso/[0.06]")}>
          <div className="h-1 w-full bg-gradient-to-r from-matcha/40 via-sky/30 to-honey/30" />
          <CardContent className="flex h-full flex-col gap-3 p-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-latte text-sm font-bold text-espresso/70">
                {opportunity.organization.charAt(0)}
              </div>
              <span className="text-xs font-medium text-espresso/50 truncate">{opportunity.organization}</span>
              {opportunity.urgent && (
                <Badge className="ml-auto rounded-full border-none bg-destructive/10 text-destructive text-[10px] font-bold px-2 py-0.5">
                  <Zap className="mr-0.5 h-2.5 w-2.5" /> Urgent
                </Badge>
              )}
            </div>
            <h3 className="text-sm font-bold leading-snug text-espresso text-balance">{opportunity.title}</h3>
            <Badge className={`w-fit rounded-full border-none text-xs font-semibold ${categoryColors[opportunity.category] ?? "bg-muted text-muted-foreground"}`}>
              {opportunity.category}
            </Badge>
            <div className="mt-auto flex items-center justify-between pt-3 border-t border-border/40">
              <div className="flex items-center gap-1 text-xs font-bold text-matcha-dark">
                <Star className="h-3 w-3 fill-matcha text-matcha" /> {opportunity.xpReward} XP
              </div>
              <div className="flex items-center gap-1 text-xs text-espresso/40">
                <Clock className="h-3 w-3" /> {opportunity.timeCommitment}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </ScaleOnTap>
  )
}

/* ── Collaboration Carousel ─── */
function CollaborationCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const partners = [
    { name: "New Brighton Park Restoration", abbr: "NB", color: "bg-matcha/15", borderColor: "border-matcha/30", textColor: "text-matcha-dark", description: "Shoreline restoration, wetland planting, and habitat monitoring across Metro Vancouver." },
    { name: "CityHive", abbr: "CH", color: "bg-rose/12", borderColor: "border-rose/25", textColor: "text-rose", description: "Youth-led civic engagement and urban sustainability programs for Vancouver communities." },
    { name: "RISE", abbr: "RI", color: "bg-honey/15", borderColor: "border-honey/30", textColor: "text-espresso/70", description: "Youth empowerment through environmental justice, leadership, and climate advocacy." },
  ]

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative flex items-center justify-center w-full max-w-lg h-[260px]">
        {partners.map((partner, i) => {
          const offset = ((i - activeIndex + 3) % 3) - 1
          const isActive = offset === 0
          return (
            <motion.div
              key={partner.name}
              animate={{
                x: offset * 80,
                scale: isActive ? 1 : 0.88,
                zIndex: isActive ? 30 : 10 - Math.abs(offset),
                opacity: isActive ? 1 : 0.6,
                rotateY: offset * -8,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute cursor-pointer w-[260px]"
              onClick={() => setActiveIndex(i)}
            >
              <Card className={cn(
                "border-2 bg-card shadow-lg overflow-hidden transition-all",
                isActive ? partner.borderColor : "border-border/40",
                isActive && "shadow-xl"
              )}>
                <div className={cn("h-2 w-full", partner.color)} />
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                  <motion.div
                    animate={{ scale: isActive ? 1 : 0.9 }}
                    className={cn("flex h-16 w-16 items-center justify-center rounded-2xl text-lg font-extrabold", partner.color, partner.textColor)}
                  >
                    {partner.abbr}
                  </motion.div>
                  <div>
                    <h3 className="text-sm font-bold text-espresso leading-tight mb-2">{partner.name}</h3>
                    <p className="text-[11px] text-espresso/40 leading-relaxed">{partner.description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Navigation dots */}
      <div className="flex items-center gap-2">
        {partners.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={cn("h-2 rounded-full transition-all", i === activeIndex ? "w-6 bg-matcha" : "w-2 bg-espresso/10 hover:bg-espresso/20")}
            aria-label={`View ${partners[i].name}`}
          />
        ))}
      </div>
    </div>
  )
}
