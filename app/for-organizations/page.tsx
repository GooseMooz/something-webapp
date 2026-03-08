"use client"

import Link from "next/link"
import { ArrowRight, Sparkles, Leaf, UtensilsCrossed, Landmark, CheckCircle2, Mail, Calendar, ClipboardList, TrendingUp, MessageSquare, Share2, Megaphone, Users, ArrowLeft } from "lucide-react"
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
  Shimmer,
} from "@/components/motion-wrapper"
import { cn } from "@/lib/utils"

const cardClass = "border-border/60 bg-card shadow-sm shadow-espresso/[0.03]"

export default function ForOrganizationsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" className="rounded-full text-sm font-semibold text-espresso/50 hover:text-espresso">
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </nav>
      </motion.header>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-16 pt-16 md:px-6 md:pb-24 md:pt-20">
        <FloatingParticles count={20} className="opacity-50" />
        <MorphBlob className="right-[-10%] top-[-10%] h-[400px] w-[400px]" color="var(--matcha)" />
        <MorphBlob className="bottom-[-20%] left-[-10%] h-[350px] w-[350px]" color="var(--sky)" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <FadeIn delay={0.1}>
            <Badge className="mb-6 rounded-full border-caramel/30 bg-caramel/10 px-5 py-2 text-sm font-semibold text-espresso/70">
              For Organizations
            </Badge>
          </FadeIn>

          <FadeIn delay={0.2}>
            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-espresso md:text-6xl text-balance mb-5">
              Partner with Something
            </h1>
          </FadeIn>

          <FadeIn delay={0.3}>
            <p className="text-lg text-espresso/55 leading-relaxed max-w-2xl mx-auto text-pretty">
              {"We connect you with motivated youth volunteers who want to make a real difference. Less admin for you, more impact for everyone."}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* What We're Looking For */}
      <section className="px-4 py-16 md:px-6 md:py-20 bg-latte/40">
        <div className="mx-auto max-w-6xl">
          <SlideUp>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-espresso md:text-4xl text-balance mb-3">
                Organizations we work with
              </h2>
              <p className="text-sm text-espresso/45 max-w-lg mx-auto">
                {"We're focused on three categories where Metro Vancouver youth can make the biggest impact."}
              </p>
            </div>
          </SlideUp>

          <StaggerChildren className="grid gap-5 md:grid-cols-3">
            {[
              { icon: Leaf, title: "Environmental", description: "Parks, conservation groups, climate orgs, community gardens, watershed stewards, and sustainability initiatives.", color: "bg-matcha/12 text-matcha-dark", accent: "from-matcha/15 to-matcha/5", examples: ["Beach cleanups", "Trail restoration", "Tree planting", "Habitat monitoring"] },
              { icon: Landmark, title: "Civic & Community", description: "Newcomer services, neighbourhood houses, civic engagement orgs, senior centers, and community foundations.", color: "bg-sky/12 text-sky-dark", accent: "from-sky/15 to-sky/5", examples: ["Welcome events", "Senior socials", "Civic workshops", "Community building"] },
              { icon: UtensilsCrossed, title: "Food & Agriculture", description: "Food banks, community kitchens, urban farms, food rescue programs, and nutrition education initiatives.", color: "bg-honey/12 text-espresso/70", accent: "from-honey/15 to-honey/5", examples: ["Food sorting", "Kitchen prep", "Urban farming", "Distribution events"] },
            ].map((area) => (
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
                      <div className="pt-3 border-t border-border/40">
                        <p className="text-[10px] font-semibold text-espresso/30 uppercase tracking-wider mb-2">Example tasks</p>
                        <div className="flex flex-wrap gap-1.5">
                          {area.examples.map((ex) => (
                            <Badge key={ex} className="rounded-full border-none bg-espresso/5 text-espresso/50 text-[10px] font-medium">
                              {ex}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* What We Ask */}
      <section className="px-4 py-16 md:px-6 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-2 items-start">
            <SlideUp>
              <div>
                <Badge className="mb-4 rounded-full border-sky/30 bg-sky/10 px-4 py-1.5 text-xs font-semibold text-sky-dark">
                  Partnership Details
                </Badge>
                <h2 className="text-3xl font-extrabold text-espresso md:text-4xl text-balance mb-4">
                  What we ask of you
                </h2>
                <p className="text-sm text-espresso/50 leading-relaxed mb-6">
                  {"We keep it simple. Our goal is to make volunteering easier for you, not harder."}
                </p>
                <div className="flex flex-col gap-3">
                  {[
                    "Share volunteer opportunities (one-time or recurring)",
                    "Provide a brief description and logistics for each task",
                    "Be available to check in volunteers when they arrive",
                    "Give simple feedback after events (optional but helpful)",
                    "Maintain a safe, welcoming environment for youth",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2.5 text-sm text-espresso/55">
                      <CheckCircle2 className="h-4 w-4 text-matcha-dark shrink-0 mt-0.5" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </SlideUp>

            <SlideUp delay={0.1}>
              <Card className={cn(cardClass, "overflow-hidden")}>
                <div className="h-2 bg-gradient-to-r from-matcha/30 via-sky/20 to-honey/20" />
                <CardContent className="p-6">
                  <h3 className="text-base font-bold text-espresso mb-4">Example simple tasks</h3>
                  <div className="flex flex-col gap-3">
                    {[
                      { title: "Beach cleanup help", org: "Stanley Park Ecology", time: "3 hours, one-time" },
                      { title: "Food bank sorting", org: "Greater Vancouver Food Bank", time: "2 hours, weekly" },
                      { title: "Event setup & greeting", org: "Collingwood Neighbourhood House", time: "4 hours, one-time" },
                      { title: "Trail maintenance", org: "Pacific Spirit Park Society", time: "3 hours, monthly" },
                      { title: "Community garden planting", org: "Vancouver Urban Farming Society", time: "2 hours, seasonal" },
                    ].map((task) => (
                      <div key={task.title} className="flex items-start gap-3 rounded-xl bg-latte/50 p-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-matcha/15 text-matcha-dark shrink-0">
                          <ClipboardList className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-espresso">{task.title}</p>
                          <p className="text-[11px] text-espresso/40">{task.org} - {task.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </SlideUp>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="px-4 py-16 md:px-6 md:py-20 bg-latte/40">
        <div className="mx-auto max-w-6xl">
          <SlideUp>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-espresso md:text-4xl text-balance mb-3">
                What you get
              </h2>
              <p className="text-sm text-espresso/45 max-w-lg mx-auto">
                {"We handle the logistics so you can focus on your mission."}
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
              { title: "Completely free", description: "Something is free for organizations during our pilot. We believe in building this together.", icon: Users, accent: "bg-sky/10 text-sky-dark" },
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

      {/* CTA Section */}
      <section className="px-4 py-16 md:px-6 md:py-20">
        <div className="mx-auto max-w-4xl">
          <SlideUp>
            <Card className="relative overflow-hidden border-none bg-espresso">
              <FloatingParticles count={12} className="opacity-30" colors={["rgba(126,200,160,0.4)", "rgba(139,184,224,0.3)", "rgba(232,184,109,0.3)"]} />
              <CardContent className="relative z-10 p-8 md:p-12">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-extrabold text-cream md:text-4xl text-balance mb-3">
                    Ready to partner with us?
                  </h2>
                  <p className="text-sm text-cream/55 leading-relaxed max-w-lg mx-auto">
                    {"Choose how you'd like to get started. We're flexible and happy to work with you however works best."}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {/* Option 1: Full signup */}
                  <Card className="bg-cream/10 border-cream/20">
                    <CardContent className="p-5 flex flex-col gap-3 h-full">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-matcha/20 text-matcha">
                        <Users className="h-5 w-5" />
                      </div>
                      <h3 className="text-sm font-bold text-cream">Create an org account</h3>
                      <p className="text-xs text-cream/50 leading-relaxed flex-1">
                        Manage your own opportunities, review applicants, and track impact.
                      </p>
                      <ScaleOnTap>
                        <Link href="/org/signup">
                          <Shimmer>
                            <Button className="w-full rounded-full bg-matcha text-espresso hover:bg-matcha-dark text-sm font-bold">
                              Sign Up <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                            </Button>
                          </Shimmer>
                        </Link>
                      </ScaleOnTap>
                    </CardContent>
                  </Card>

                  {/* Option 2: Submit task */}
                  <Card className="bg-cream/10 border-cream/20">
                    <CardContent className="p-5 flex flex-col gap-3 h-full">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky/20 text-sky">
                        <ClipboardList className="h-5 w-5" />
                      </div>
                      <h3 className="text-sm font-bold text-cream">Submit a task</h3>
                      <p className="text-xs text-cream/50 leading-relaxed flex-1">
                        {"Just send us the details and we'll handle posting and managing volunteers for you."}
                      </p>
                      <ScaleOnTap>
                        <Link href="https://forms.gle/placeholder" target="_blank">
                          <Button variant="outline" className="w-full rounded-full border-cream/30 text-cream hover:bg-cream/10 text-sm font-bold">
                            Submit Task <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </ScaleOnTap>
                    </CardContent>
                  </Card>

                  {/* Option 3: Meet us */}
                  <Card className="bg-cream/10 border-cream/20">
                    <CardContent className="p-5 flex flex-col gap-3 h-full">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-honey/20 text-honey">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <h3 className="text-sm font-bold text-cream">Meet with us</h3>
                      <p className="text-xs text-cream/50 leading-relaxed flex-1">
                        {"Have questions? Let's chat. We'd love to learn about your org and how we can help."}
                      </p>
                      <ScaleOnTap>
                        <Link href="https://calendly.com/placeholder" target="_blank">
                          <Button variant="outline" className="w-full rounded-full border-cream/30 text-cream hover:bg-cream/10 text-sm font-bold">
                            Book a Call <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </ScaleOnTap>
                    </CardContent>
                  </Card>
                </div>

                {/* Contact info */}
                <div className="mt-8 pt-6 border-t border-cream/10 text-center">
                  <p className="text-xs text-cream/40 mb-2">Or reach out directly:</p>
                  <a href="mailto:hello@something.community" className="inline-flex items-center gap-2 text-sm font-semibold text-cream/70 hover:text-cream transition-colors">
                    <Mail className="h-4 w-4" />
                    hello@something.community
                  </a>
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
