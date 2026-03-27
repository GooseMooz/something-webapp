"use client"

import { motion } from "framer-motion"
import { Globe, Mail, Phone, MapPin, Users, CheckCircle2, Edit3, ExternalLink, Sparkles } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FadeIn, SlideUp, ScaleOnTap } from "@/components/motion-wrapper"
import { mockOrg  } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const cardClass = "border-border/60 bg-card shadow-sm shadow-espresso/[0.03]"

export default function OrgProfilePage() {
  const org = mockOrg
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 pb-24 md:px-6 md:py-8 md:pb-8">
      {/* Header */}
      <FadeIn>
        <Card className={cn(cardClass, "overflow-hidden mb-5")}>
          <div className="h-24 bg-gradient-to-r from-matcha/25 via-sky/20 to-honey/15" />
          <CardContent className="relative px-5 pb-5 sm:px-6 sm:pb-6">
            <div className="flex flex-col items-center -mt-10 sm:flex-row sm:items-end sm:gap-5">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="flex h-20 w-20 items-center justify-center rounded-2xl bg-matcha/20 border-4 border-card text-2xl font-extrabold text-espresso shadow-lg"
              >
                {org.logo}
              </motion.div>
              <div className="mt-2 flex flex-1 flex-col items-center sm:items-start sm:mt-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-extrabold text-espresso">{org.name}</h1>
                  <CheckCircle2 className="h-4 w-4 text-matcha-dark" />
                </div>
                <p className="text-xs text-espresso/40">{org.type}</p>
              </div>
              <div className="mt-3 flex gap-2 sm:mt-0">
                <ScaleOnTap>
                  <Button size="sm" className="rounded-full bg-espresso text-card hover:bg-espresso/90 text-xs font-bold h-8">
                    <Edit3 className="mr-1.5 h-3 w-3" /> Edit Profile
                  </Button>
                </ScaleOnTap>
              </div>
            </div>
            <p className="mt-3 text-sm text-espresso/50 leading-relaxed max-w-xl mx-auto sm:mx-0">{org.description}</p>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Details Grid */}
      <div className="grid gap-4 lg:grid-cols-5 mb-4">
        <SlideUp delay={0.06} className="lg:col-span-3">
          <Card className={cn(cardClass, "h-full")}>
            <CardContent className="p-5">
              <h3 className="text-sm font-bold text-espresso mb-4">Organization Details</h3>
              <div className="flex flex-col gap-3">
                {[
                  { icon: Globe, label: "Website", value: org.socialLinks.website, link: true },
                  { icon: Mail, label: "Email", value: org.email },
                  { icon: Phone, label: "Phone", value: org.phone },
                  { icon: MapPin, label: "Location", value: org.location },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky/10 text-sky-dark shrink-0">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-espresso/30">{item.label}</span>
                      <p className="text-sm font-semibold text-espresso">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="mt-5 pt-4 border-t border-border/40">
                <h4 className="text-xs font-bold text-espresso/40 mb-3">Social Links</h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Twitter", value: org.socialLinks.twitter },
                    { label: "Instagram", value: org.socialLinks.instagram },
                    { label: "Website", value: org.socialLinks.website },
                  ].map(s => (
                    <Badge key={s.label} className="rounded-full border-none bg-latte text-espresso/50 text-xs font-semibold flex items-center gap-1">
                      <ExternalLink className="h-2.5 w-2.5" /> {s.value}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </SlideUp>

        <SlideUp delay={0.1} className="lg:col-span-2">
          <Card className={cn(cardClass, "h-full")}>
            <CardContent className="p-5">
              <h3 className="text-sm font-bold text-espresso mb-4">Stats at a Glance</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Events", value: org.totalEvents },
                  { label: "Volunteers", value: org.totalVolunteers },
                  { label: "Completed", value: org.completedEvents },
                  { label: "Total Hired", value: org.totalHired },
                ].map(stat => (
                  <div key={stat.label} className="flex flex-col items-center gap-0.5 rounded-xl bg-latte/50 p-3">
                    <span className="text-xl font-extrabold text-espresso">{stat.value}</span>
                    <span className="text-[9px] font-semibold text-espresso/30">{stat.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </SlideUp>
      </div>

      {/* How Volunteers See Your Org */}
      <SlideUp delay={0.15}>
        <Card className={cardClass}>
          <CardContent className="p-5">
            <h3 className="text-sm font-bold text-espresso mb-1">How volunteers see your organization</h3>
            <p className="text-[10px] text-espresso/35 mb-4">This card appears on every opportunity you post.</p>
            <div className="rounded-xl border border-border/60 bg-latte/20 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-matcha/15 text-base font-extrabold text-matcha-dark">{org.logo}</div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-espresso">{org.name}</h4>
                    <CheckCircle2 className="h-3.5 w-3.5 text-matcha-dark" />
                  </div>
                  <p className="text-[10px] text-espresso/40">{org.type}</p>
                </div>
              </div>
              <p className="text-xs text-espresso/45 leading-relaxed mb-3 line-clamp-2">{org.description}</p>
              <div className="flex items-center gap-4 text-[10px] text-espresso/35 mb-3">
                <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-matcha-dark" /> Verified</span>
                <span className="flex items-center gap-1"><Sparkles className="h-3 w-3 text-honey" /> 4.8 rating</span>
                <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {org.totalVolunteers}+ volunteers</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-border/40">
                <a href={`mailto:${org.email}`} className="flex items-center gap-1 rounded-full bg-sky/10 px-2.5 py-1 text-[10px] font-semibold text-sky-dark hover:bg-sky/20 transition-colors">
                  <Mail className="h-2.5 w-2.5" /> {org.email}
                </a>
                <a href={`https://${org.socialLinks.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 rounded-full bg-matcha/10 px-2.5 py-1 text-[10px] font-semibold text-matcha-dark hover:bg-matcha/20 transition-colors">
                  <ExternalLink className="h-2.5 w-2.5" /> Website
                </a>
                <a href={`https://instagram.com/${org.socialLinks.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 rounded-full bg-rose/10 px-2.5 py-1 text-[10px] font-semibold text-rose hover:bg-rose/15 transition-colors">
                  <ExternalLink className="h-2.5 w-2.5" /> Instagram
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </SlideUp>
    </div>
  )
}
