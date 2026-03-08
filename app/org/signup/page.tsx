"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Check,
  Building2,
  Leaf,
  Landmark,
  UtensilsCrossed,
  Globe,
  Mail,
  Phone,
  MapPin,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FadeIn, ScaleOnTap } from "@/components/motion-wrapper"
import { cn } from "@/lib/utils"

const orgTypeOptions = [
  { id: "environmental", label: "Environmental", icon: Leaf, description: "Parks, conservation, climate orgs" },
  { id: "civic", label: "Civic & Community", icon: Landmark, description: "Newcomer services, neighbourhood houses" },
  { id: "food", label: "Food & Agriculture", icon: UtensilsCrossed, description: "Food banks, community kitchens, farms" },
]

export default function OrgSignupPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const totalSteps = 3
  const progress = ((step + 1) / totalSteps) * 100

  function handleNext() {
    if (step < totalSteps - 1) {
      setStep(step + 1)
    } else {
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
        router.push("/org/dashboard")
      }, 1500)
    }
  }

  function handleBack() {
    if (step > 0) setStep(step - 1)
  }

  const canProceed =
    step === 0
      ? true // Basic info filled (simplified for demo)
      : step === 1
        ? selectedType !== null
        : true // Contact info

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      {/* Decorative shapes */}
      <div className="pointer-events-none absolute right-[12%] top-[15%] h-44 w-44 rounded-full bg-sky/10 blur-3xl" />
      <div className="pointer-events-none absolute left-[8%] bottom-[15%] h-36 w-36 rounded-full bg-matcha/10 blur-3xl" />

      <FadeIn className="w-full max-w-lg">
        {/* Logo */}
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-matcha text-espresso">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-2xl font-extrabold text-espresso">Something</span>
        </Link>

        {/* Progress Bar */}
        <div className="mb-6 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-sky"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          </div>
          <span className="text-xs font-bold text-espresso/40">
            {step + 1}/{totalSteps}
          </span>
        </div>

        <Card className="border-border/60 bg-card shadow-xl shadow-espresso/5">
          <CardContent className="p-6 md:p-8">
            <AnimatePresence mode="wait">
              {/* ── Step 1: Organization Info ─── */}
              {step === 0 && (
                <motion.div
                  key="step-0"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-5"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky/15 text-sky-dark">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <h1 className="text-2xl font-extrabold text-espresso">
                        Organization Signup
                      </h1>
                    </div>
                    <p className="text-sm text-espresso/50">
                      Register your organization to post volunteer opportunities.
                    </p>
                  </div>

                  {/* Basic Fields */}
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="org-name" className="text-espresso/70">
                        Organization Name
                      </Label>
                      <Input
                        id="org-name"
                        placeholder="Vancouver Community Kitchen"
                        className="rounded-xl border-border bg-background h-11"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="contact-name" className="text-espresso/70">
                        Your Name
                      </Label>
                      <Input
                        id="contact-name"
                        placeholder="Jane Smith"
                        className="rounded-xl border-border bg-background h-11"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="org-email" className="text-espresso/70">
                        Email
                      </Label>
                      <Input
                        id="org-email"
                        type="email"
                        placeholder="contact@yourorg.org"
                        className="rounded-xl border-border bg-background h-11"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="org-password" className="text-espresso/70">
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="org-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          className="rounded-xl border-border bg-background h-11 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-espresso/40 hover:text-espresso/60"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── Step 2: Organization Type ─── */}
              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-5"
                >
                  <div>
                    <h2 className="text-2xl font-extrabold text-espresso">
                      Organization Type
                    </h2>
                    <p className="mt-1 text-sm text-espresso/50">
                      What category best describes your organization?
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    {orgTypeOptions.map((type) => {
                      const isSelected = selectedType === type.id
                      return (
                        <button
                          key={type.id}
                          onClick={() => setSelectedType(type.id)}
                          className={cn(
                            "flex items-center gap-4 rounded-2xl border-2 p-4 transition-all text-left",
                            isSelected
                              ? "border-sky bg-sky/10"
                              : "border-border hover:border-sky/40"
                          )}
                        >
                          <div
                            className={cn(
                              "flex h-12 w-12 items-center justify-center rounded-xl shrink-0",
                              isSelected ? "bg-sky text-espresso" : "bg-muted text-espresso/40"
                            )}
                          >
                            <type.icon className="h-6 w-6" />
                          </div>
                          <div>
                            <span className="text-sm font-bold text-espresso">{type.label}</span>
                            <p className="text-xs text-espresso/45 mt-0.5">{type.description}</p>
                          </div>
                          {isSelected && (
                            <Check className="ml-auto h-5 w-5 text-sky-dark shrink-0" />
                          )}
                        </button>
                      )
                    })}
                  </div>

                  {/* Description */}
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="org-description" className="text-espresso/70">
                      Brief Description
                    </Label>
                    <textarea
                      id="org-description"
                      rows={3}
                      placeholder="Tell us about your organization and mission..."
                      className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none resize-none"
                    />
                  </div>
                </motion.div>
              )}

              {/* ── Step 3: Contact & Location ─── */}
              {step === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-5"
                >
                  <div>
                    <h2 className="text-2xl font-extrabold text-espresso">
                      Contact Details
                    </h2>
                    <p className="mt-1 text-sm text-espresso/50">
                      Help volunteers and our team get in touch with you.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="org-phone" className="text-espresso/70">
                        <Phone className="inline h-3.5 w-3.5 mr-1.5" />
                        Phone (optional)
                      </Label>
                      <Input
                        id="org-phone"
                        type="tel"
                        placeholder="(604) 555-0123"
                        className="rounded-xl border-border bg-background h-11"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="org-website" className="text-espresso/70">
                        <Globe className="inline h-3.5 w-3.5 mr-1.5" />
                        Website (optional)
                      </Label>
                      <Input
                        id="org-website"
                        type="url"
                        placeholder="https://yourorg.org"
                        className="rounded-xl border-border bg-background h-11"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="org-location" className="text-espresso/70">
                        <MapPin className="inline h-3.5 w-3.5 mr-1.5" />
                        Location
                      </Label>
                      <Input
                        id="org-location"
                        placeholder="Vancouver, BC"
                        className="rounded-xl border-border bg-background h-11"
                      />
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="rounded-xl bg-latte/50 p-4 text-xs text-espresso/50 leading-relaxed">
                    By creating an account, you agree to our Terms of Service and Privacy Policy. 
                    {"We'll"} review your organization within 2-3 business days.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="mt-6 flex items-center justify-between gap-3">
              {step > 0 ? (
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="rounded-full font-semibold text-espresso/60 hover:text-espresso"
                >
                  <ArrowLeft className="mr-1.5 h-4 w-4" />
                  Back
                </Button>
              ) : (
                <Link href="/for-organizations">
                  <Button
                    variant="ghost"
                    className="rounded-full font-semibold text-espresso/60 hover:text-espresso"
                  >
                    <ArrowLeft className="mr-1.5 h-4 w-4" />
                    Back
                  </Button>
                </Link>
              )}
              <ScaleOnTap>
                <Button
                  onClick={handleNext}
                  disabled={!canProceed || isLoading}
                  className="rounded-full bg-sky px-6 font-bold text-espresso hover:bg-sky-dark h-11"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-5 w-5 rounded-full border-2 border-espresso/20 border-t-espresso"
                    />
                  ) : step === totalSteps - 1 ? (
                    <>
                      Create Account
                      <Sparkles className="ml-1.5 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="ml-1.5 h-4 w-4" />
                    </>
                  )}
                </Button>
              </ScaleOnTap>
            </div>

            {step === 0 && (
              <p className="mt-6 text-center text-sm text-espresso/50">
                Already have an account?{" "}
                <Link href="/org/login" className="font-semibold text-sky-dark hover:underline">
                  Log in
                </Link>
              </p>
            )}
          </CardContent>
        </Card>

        {/* Alternative option */}
        <div className="mt-6 text-center">
          <p className="text-xs text-espresso/40">
            {"Don't want to manage your own page?"}{" "}
            <Link href="https://forms.gle/placeholder" className="font-semibold text-espresso/60 hover:text-espresso hover:underline">
              Submit a task to our team instead
            </Link>
          </p>
        </div>
      </FadeIn>
    </div>
  )
}
