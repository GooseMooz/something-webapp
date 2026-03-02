"use client"

import Link from "next/link"
import { ArrowRight, Sparkles, Heart, TrendingUp, MapPin, Clock, Zap, Star } from "lucide-react"
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

const steps = [
  {
    step: "01",
    title: "Create Your Profile",
    description: "Sign up in 3 minutes. Tell us your skills, passions, and the causes you care about.",
    icon: Sparkles,
    color: "bg-matcha/15 text-matcha-dark",
    gradient: "from-matcha/20 to-matcha/5",
  },
  {
    step: "02",
    title: "Browse & Apply",
    description: "Discover opportunities matched to your vibe. One-tap apply makes it easy.",
    icon: MapPin,
    color: "bg-sky/15 text-sky-dark",
    gradient: "from-sky/20 to-sky/5",
  },
  {
    step: "03",
    title: "Show Up & Level Up",
    description: "Volunteer, earn XP, unlock badges, and build a portfolio that shows your impact.",
    icon: TrendingUp,
    color: "bg-caramel/15 text-espresso",
    gradient: "from-chart-4/20 to-chart-4/5",
  },
]

const stats = [
  { value: 2400, suffix: "+", label: "Active Volunteers", icon: "person" },
  { value: 15000, suffix: "+", label: "Hours Logged", icon: "clock" },
  { value: 180, suffix: "+", label: "Partner Orgs", icon: "building" },
  { value: 340, suffix: "+", label: "Opportunities", icon: "spark" },
]

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
                  Get Started
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </Link>
            </ScaleOnTap>
          </div>
          <div className="flex items-center gap-2 sm:hidden">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="rounded-full text-sm font-semibold text-espresso/60">
                Log In
              </Button>
            </Link>
            <ScaleOnTap>
              <Link href="/signup">
                <Button size="sm" className="rounded-full bg-espresso text-card hover:bg-espresso/90 text-sm font-bold">
                  Sign Up
                </Button>
              </Link>
            </ScaleOnTap>
          </div>
        </nav>
      </motion.header>

      {/* ── Hero Section ─── */}
      <section className="relative overflow-hidden px-4 pb-20 pt-16 md:px-6 md:pb-32 md:pt-24">
        {/* Ambient particles */}
        <FloatingParticles count={30} className="opacity-60" />

        {/* Morphing blobs */}
        <MorphBlob className="right-[-10%] top-[-10%] h-[500px] w-[500px]" color="var(--matcha)" />
        <MorphBlob className="bottom-[-20%] left-[-10%] h-[400px] w-[400px]" color="var(--sky)" />

        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center">
            <FadeIn delay={0.1}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Badge className="mb-6 rounded-full border-matcha/30 bg-matcha/10 px-5 py-2 text-sm font-semibold text-matcha-dark">
                  <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                  Metro Vancouver{"'"}s Youth Volunteer Platform
                </Badge>
              </motion.div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <h1 className="max-w-4xl text-5xl font-extrabold leading-[1.1] tracking-tight text-espresso md:text-7xl text-balance">
                Do{" "}
                <span className="relative inline-block">
                  <WavyText text="Something" className="text-matcha-dark" delay={0.5} />
                  <motion.svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 300 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
                  >
                    <motion.path
                      d="M2 8C50 3 100 2 150 5C200 8 250 4 298 6"
                      stroke="var(--matcha)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
                    />
                  </motion.svg>
                </span>
                <br />
                That Matters
              </h1>
            </FadeIn>

            <FadeIn delay={0.4}>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-espresso/55 md:text-xl text-pretty">
                Find volunteer opportunities that match your passions, earn XP for
                your impact, and connect with a community of young changemakers.
              </p>
            </FadeIn>

            <FadeIn delay={0.55}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <ScaleOnTap>
                  <Link href="/opportunities">
                    <Shimmer>
                      <Button
                        size="lg"
                        className="rounded-full bg-matcha px-9 py-6 text-base font-bold text-espresso hover:bg-matcha-dark"
                      >
                        Find Opportunities
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Shimmer>
                  </Link>
                </ScaleOnTap>
                <ScaleOnTap>
                  <Link href="/signup">
                    <Button
                      variant="outline"
                      size="lg"
                      className="rounded-full border-espresso/15 px-9 py-6 text-base font-bold text-espresso hover:bg-espresso/5"
                    >
                      I{"'"}m an Organization
                    </Button>
                  </Link>
                </ScaleOnTap>
              </div>
            </FadeIn>

            {/* Social proof */}
            <FadeIn delay={0.7}>
              <div className="mt-12 flex items-center gap-3 rounded-full bg-card/80 px-5 py-2.5 shadow-sm backdrop-blur-sm border border-border/40">
                <div className="flex -space-x-2">
                  {["bg-matcha/30", "bg-sky/30", "bg-caramel/30", "bg-chart-4/30", "bg-matcha/20"].map((bg, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, x: -10 }}
                      animate={{ scale: 1, x: 0 }}
                      transition={{ delay: 0.8 + i * 0.08, type: "spring", stiffness: 400 }}
                      className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-card text-xs font-bold text-espresso/50 ${bg}`}
                    >
                      {String.fromCharCode(64 + i + 1)}
                    </motion.div>
                  ))}
                </div>
                <p className="text-sm text-espresso/50">
                  <span className="font-bold text-espresso">2,400+</span> youth already making a difference
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Featured Opportunities ─── */}
      <section className="relative px-4 py-16 md:px-6 md:py-24">
        <FloatingParticles count={10} className="opacity-30" colors={["var(--sky)", "var(--matcha)"]} />
        <div className="relative z-10 mx-auto max-w-6xl">
          <SlideUp>
            <div className="mb-12 flex flex-col items-center text-center">
              <motion.div whileHover={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 0.4 }}>
                <Badge className="mb-4 rounded-full border-sky/30 bg-sky/10 px-5 py-2 text-sm font-semibold text-sky-dark">
                  <Zap className="mr-1.5 h-3.5 w-3.5" />
                  Trending Now
                </Badge>
              </motion.div>
              <h2 className="text-3xl font-extrabold text-espresso md:text-5xl text-balance">
                Opportunities Waiting for You
              </h2>
              <p className="mt-4 max-w-lg text-base text-espresso/50 md:text-lg text-pretty">
                Handpicked opportunities that match what Vancouver youth care about most.
              </p>
            </div>
          </SlideUp>

          <StaggerChildren className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((op) => (
              <StaggerItem key={op.id}>
                <FeaturedCard opportunity={op} />
              </StaggerItem>
            ))}
          </StaggerChildren>

          <SlideUp delay={0.3}>
            <div className="mt-12 flex justify-center">
              <ScaleOnTap>
                <Link href="/opportunities">
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full border-border px-9 py-6 font-bold text-espresso hover:bg-latte"
                  >
                    View All Opportunities
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </ScaleOnTap>
            </div>
          </SlideUp>
        </div>
      </section>

      {/* ── How It Works ─── */}
      <section className="relative bg-latte/50 px-4 py-16 md:px-6 md:py-28">
        <div className="mx-auto max-w-6xl">
          <SlideUp>
            <div className="mb-14 text-center">
              <h2 className="text-3xl font-extrabold text-espresso md:text-5xl text-balance">
                How It Works
              </h2>
              <p className="mt-4 text-base text-espresso/50 md:text-lg">
                Three steps to start making an impact.
              </p>
            </div>
          </SlideUp>

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, i) => (
              <SlideUp key={step.step} delay={i * 0.12}>
                <motion.div
                  whileHover={{ y: -8, transition: { type: "spring", stiffness: 300 } }}
                  className="h-full"
                >
                  <Card className="relative overflow-hidden border-border/40 bg-card h-full">
                    {/* Gradient accent strip */}
                    <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${step.gradient}`} />
                    <CardContent className="flex flex-col gap-5 p-7 pt-8">
                      <div className="flex items-center gap-4">
                        <motion.div
                          whileHover={{ rotate: 10, scale: 1.1 }}
                          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${step.color}`}
                        >
                          <step.icon className="h-7 w-7" />
                        </motion.div>
                        <span className="text-4xl font-extrabold text-espresso/8">
                          {step.step}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-espresso">
                        {step.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-espresso/55">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </SlideUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── Impact Stats ─── */}
      <section className="relative overflow-hidden px-4 py-16 md:px-6 md:py-28">
        <MorphBlob className="left-[20%] top-[10%] h-[300px] w-[300px]" color="var(--sky)" />
        <div className="relative z-10 mx-auto max-w-6xl">
          <SlideUp>
            <div className="mb-14 text-center">
              <h2 className="text-3xl font-extrabold text-espresso md:text-5xl text-balance">
                Our Collective Impact
              </h2>
              <p className="mt-4 text-base text-espresso/50 md:text-lg">
                Real numbers from real youth making real change.
              </p>
            </div>
          </SlideUp>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {stats.map((stat, i) => (
              <SlideUp key={stat.label} delay={i * 0.1}>
                <motion.div whileHover={{ y: -6, scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Card className="border-border/40 bg-card text-center overflow-hidden group">
                    <CardContent className="relative p-7">
                      {/* Background accent pulse */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-matcha/5 to-sky/5 opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                      <p className="relative text-4xl font-extrabold text-espresso md:text-5xl">
                        <AnimatedCounter
                          target={stat.value}
                          suffix={stat.suffix}
                          duration={2.5}
                        />
                      </p>
                      <p className="relative mt-2 text-sm font-semibold text-espresso/45">
                        {stat.label}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </SlideUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─── */}
      <section className="px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-4xl">
          <SlideUp>
            <Card className="relative overflow-hidden border-none bg-espresso">
              {/* Particle overlay */}
              <FloatingParticles
                count={15}
                className="opacity-40"
                colors={["rgba(162,225,157,0.4)", "rgba(149,192,238,0.3)", "rgba(245,199,126,0.3)"]}
              />
              <CardContent className="relative z-10 flex flex-col items-center gap-7 p-10 text-center md:p-16">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="flex h-16 w-16 items-center justify-center rounded-2xl bg-matcha/20"
                >
                  <Heart className="h-8 w-8 text-matcha" />
                </motion.div>
                <h2 className="text-3xl font-extrabold text-cream md:text-5xl text-balance">
                  Ready to Do Something?
                </h2>
                <p className="max-w-lg text-base text-cream/55 leading-relaxed md:text-lg text-pretty">
                  Join thousands of Metro Vancouver youth who are turning their
                  free time into real community impact. Your next adventure is
                  one click away.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <ScaleOnTap>
                    <Link href="/signup">
                      <Shimmer>
                        <Button
                          size="lg"
                          className="rounded-full bg-matcha px-9 py-6 text-base font-bold text-espresso hover:bg-matcha-dark"
                        >
                          Get Started Free
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Shimmer>
                    </Link>
                  </ScaleOnTap>
                  <ScaleOnTap>
                    <Link href="/opportunities">
                      <Button
                        variant="outline"
                        size="lg"
                        className="rounded-full border-cream/20 px-9 py-6 text-base font-bold text-cream hover:bg-cream/10"
                      >
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

/* ── Featured Card (Landing specific, compact) ─── */
function FeaturedCard({
  opportunity,
}: {
  opportunity: (typeof mockOpportunities)[number]
}) {
  const categoryColors: Record<string, string> = {
    Environment: "bg-matcha/20 text-accent-foreground",
    Education: "bg-sky/20 text-sky-dark",
    Community: "bg-caramel/20 text-espresso",
    "Arts & Culture": "bg-chart-4/20 text-espresso",
  }

  return (
    <ScaleOnTap className="w-full">
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="h-full"
      >
        <Card className="group h-full border-border/40 bg-card transition-shadow hover:shadow-xl hover:shadow-espresso/8 overflow-hidden">
          {/* Top accent line */}
          <div className="h-1 w-full bg-gradient-to-r from-matcha/40 via-sky/30 to-chart-4/30" />
          <CardContent className="flex h-full flex-col gap-3 p-5">
            <div className="flex items-center gap-2.5">
              <motion.div
                whileHover={{ rotate: -10 }}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-latte text-sm font-bold text-espresso/70"
              >
                {opportunity.organization.charAt(0)}
              </motion.div>
              <span className="text-xs font-medium text-espresso/50 truncate">
                {opportunity.organization}
              </span>
              {opportunity.urgent && (
                <Badge className="ml-auto rounded-full border-none bg-destructive/10 text-destructive text-[10px] font-bold px-2 py-0.5">
                  <Zap className="mr-0.5 h-2.5 w-2.5" />
                  Urgent
                </Badge>
              )}
            </div>
            <h3 className="text-sm font-bold leading-snug text-espresso text-balance">
              {opportunity.title}
            </h3>
            <Badge
              className={`w-fit rounded-full border-none text-xs font-semibold ${
                categoryColors[opportunity.category] ?? "bg-muted text-muted-foreground"
              }`}
            >
              {opportunity.category}
            </Badge>
            <div className="mt-auto flex items-center justify-between pt-3 border-t border-border/40">
              <div className="flex items-center gap-1 text-xs font-bold text-matcha-dark">
                <Star className="h-3 w-3 fill-matcha text-matcha" />
                {opportunity.xpReward} XP
              </div>
              <div className="flex items-center gap-1 text-xs text-espresso/40">
                <Clock className="h-3 w-3" />
                {opportunity.timeCommitment}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </ScaleOnTap>
  )
}
