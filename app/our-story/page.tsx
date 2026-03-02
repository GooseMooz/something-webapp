"use client"

import Link from "next/link"
import { ArrowRight, Sparkles, Heart, Users, Globe, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  FadeIn,
  SlideUp,
  StaggerChildren,
  StaggerItem,
  ScaleOnTap,
  AnimatedCounter,
} from "@/components/motion-wrapper"
import { Footer } from "@/components/footer"

const values = [
  {
    title: "Youth-First Design",
    description: "Every feature is built for how young people actually use technology -- fast, mobile, social.",
    icon: Users,
    color: "bg-matcha/12 text-matcha-dark",
  },
  {
    title: "Trust & Safety",
    description: "Verified organizations, transparent reviews, and a trust score system that protects everyone.",
    icon: Heart,
    color: "bg-sky/12 text-sky-dark",
  },
  {
    title: "Local Impact",
    description: "Rooted in Metro Vancouver with plans to grow. Every hour logged makes a real difference here.",
    icon: Globe,
    color: "bg-honey/12 text-espresso/70",
  },
]

const timeline = [
  { year: "2025", event: "Founded by a group of UBC students frustrated with disconnected volunteer platforms." },
  { year: "2025", event: "Beta launched with 50 youth and 12 local organizations." },
  { year: "2026", event: "Grew to 2,400+ active volunteers and 180 partner orgs across Metro Vancouver." },
  { year: "2026", event: "Gamification system launched -- XP, badges, and leaderboards." },
  { year: "Next", event: "Expanding to more BC communities and adding team volunteering features." },
]

export default function OurStoryPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Simple nav for this page */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-card/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-matcha text-espresso">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-xl font-extrabold text-espresso">Something</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm" className="rounded-full text-xs font-semibold text-espresso/50">
              <ArrowLeft className="mr-1.5 h-3 w-3" />
              Home
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="px-4 py-16 md:px-6 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <FadeIn>
            <h1 className="text-4xl font-extrabold text-espresso md:text-6xl text-balance leading-[1.1]">
              Why We Built{" "}
              <span className="text-matcha-dark">Something</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="mt-6 text-lg text-espresso/45 leading-relaxed max-w-xl mx-auto text-pretty">
              We believe every young person has the power to make a difference. We just needed to make it easier to start.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* The Problem */}
      <section className="bg-latte/50 px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-3xl">
          <SlideUp>
            <h2 className="text-2xl font-extrabold text-espresso mb-6 md:text-3xl">The Problem</h2>
            <div className="flex flex-col gap-4 text-sm text-espresso/55 leading-relaxed">
              <p>
                Volunteering in Metro Vancouver was broken. Youth wanted to help but couldn{"'"}t find opportunities that fit their schedule, matched their interests, or felt meaningful.
              </p>
              <p>
                Organizations needed volunteers but were drowning in outdated sign-up sheets and email chains. The matching was manual, the experience was forgettable, and nobody was tracking the incredible impact being made.
              </p>
              <p>
                We asked ourselves: <span className="font-bold text-espresso">What if volunteering felt as engaging as the apps young people already love?</span>
              </p>
            </div>
          </SlideUp>
        </div>
      </section>

      {/* Values */}
      <section className="px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-4xl">
          <SlideUp>
            <h2 className="text-2xl font-extrabold text-espresso mb-10 text-center md:text-3xl">What We Stand For</h2>
          </SlideUp>
          <StaggerChildren className="grid gap-5 md:grid-cols-3">
            {values.map((value) => (
              <StaggerItem key={value.title}>
                <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Card className="border-border/40 bg-card h-full">
                    <CardContent className="flex flex-col gap-4 p-6">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${value.color}`}>
                        <value.icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-base font-bold text-espresso">{value.title}</h3>
                      <p className="text-xs text-espresso/45 leading-relaxed">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-latte/50 px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-2xl">
          <SlideUp>
            <h2 className="text-2xl font-extrabold text-espresso mb-10 text-center md:text-3xl">Our Journey</h2>
          </SlideUp>
          <div className="relative">
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border/60" />
            {timeline.map((item, i) => (
              <SlideUp key={i} delay={i * 0.08}>
                <div className="relative flex gap-5 pb-8 last:pb-0">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.1, type: "spring" }}
                    className="relative z-10 flex h-10 w-10 items-center justify-center rounded-xl bg-card border border-border/40 text-xs font-extrabold text-espresso shrink-0"
                  >
                    {item.year}
                  </motion.div>
                  <p className="text-sm text-espresso/55 leading-relaxed pt-2">{item.event}</p>
                </div>
              </SlideUp>
            ))}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <SlideUp>
            <h2 className="text-2xl font-extrabold text-espresso mb-10 md:text-3xl">The Impact So Far</h2>
          </SlideUp>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { value: 2400, suffix: "+", label: "Active Volunteers" },
              { value: 15000, suffix: "+", label: "Hours Logged" },
              { value: 180, suffix: "+", label: "Partner Organizations" },
              { value: 340, suffix: "+", label: "Opportunities Posted" },
            ].map((stat, i) => (
              <SlideUp key={stat.label} delay={i * 0.08}>
                <Card className="border-border/40 bg-card">
                  <CardContent className="p-6">
                    <p className="text-3xl font-extrabold text-espresso md:text-4xl">
                      <AnimatedCounter target={stat.value} suffix={stat.suffix} duration={2} />
                    </p>
                    <p className="mt-1.5 text-xs font-semibold text-espresso/35">{stat.label}</p>
                  </CardContent>
                </Card>
              </SlideUp>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-2xl">
          <SlideUp>
            <Card className="border-none bg-espresso overflow-hidden">
              <CardContent className="flex flex-col items-center gap-5 p-10 text-center md:p-14">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="flex h-14 w-14 items-center justify-center rounded-2xl bg-matcha/20"
                >
                  <Heart className="h-7 w-7 text-matcha" />
                </motion.div>
                <h2 className="text-2xl font-extrabold text-cream md:text-3xl text-balance">
                  Ready to Do Something?
                </h2>
                <p className="text-sm text-cream/45 max-w-md leading-relaxed">
                  Whether you want to volunteer or need volunteers, we{"'"}d love for you to be part of this.
                </p>
                <div className="flex gap-3">
                  <ScaleOnTap>
                    <Link href="/signup">
                      <Button size="lg" className="rounded-full bg-matcha text-espresso hover:bg-matcha-dark font-bold px-8">
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4" />
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
