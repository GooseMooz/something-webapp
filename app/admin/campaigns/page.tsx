"use client"

import { useState } from "react"
import { Mail, Send, Users, Building2, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { adminApi } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

type Audience = "users" | "orgs" | "all"

const audienceOptions: { value: Audience; label: string; desc: string; icon: React.ElementType }[] = [
  { value: "users",  label: "Volunteers",     desc: "All registered users",      icon: Users },
  { value: "orgs",   label: "Organizations",  desc: "All registered orgs",       icon: Building2 },
  { value: "all",    label: "Everyone",       desc: "Users and organizations",   icon: Globe },
]

interface SendResult {
  sent: number
  skipped: number
  invalid_emails: string[]
}

export default function AdminCampaignsPage() {
  const { token } = useAuth()
  const [audience, setAudience] = useState<Audience>("all")
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<SendResult | null>(null)

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!token || !subject.trim() || !body.trim()) return
    if (subject.includes("\n")) {
      toast.error("Subject cannot contain line breaks")
      return
    }

    setSending(true)
    setResult(null)
    try {
      const res = await adminApi.sendCampaign({ audience, subject: subject.trim(), body: body.trim() }, token)
      setResult(res)
      toast.success(`Campaign sent to ${res.sent} recipient${res.sent !== 1 ? "s" : ""}`)
      setSubject("")
      setBody("")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send campaign")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="px-4 py-6 md:px-8 md:py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-espresso">Email Campaigns</h1>
        <p className="text-sm text-espresso/50 mt-1">Send a message to users, organizations, or everyone.</p>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSend} className="space-y-5">
          {/* Audience */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-espresso/70">Audience</Label>
            <div className="grid grid-cols-3 gap-2">
              {audienceOptions.map(({ value, label, desc, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setAudience(value)}
                  className={cn(
                    "flex flex-col items-start gap-1.5 rounded-xl border p-3 text-left transition-all",
                    audience === value
                      ? "border-espresso/30 bg-espresso/5 ring-1 ring-espresso/20"
                      : "border-border/60 bg-card hover:border-espresso/20 hover:bg-muted/30"
                  )}
                >
                  <div className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-lg",
                    audience === value ? "bg-espresso/10" : "bg-muted"
                  )}>
                    <Icon className={cn("h-3.5 w-3.5", audience === value ? "text-espresso" : "text-espresso/50")} />
                  </div>
                  <div>
                    <div className={cn("text-xs font-semibold", audience === value ? "text-espresso" : "text-espresso/70")}>{label}</div>
                    <div className="text-[10px] text-espresso/40 leading-tight">{desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-1.5">
            <Label htmlFor="subject" className="text-sm font-medium text-espresso/70">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Volunteer fair this Saturday!"
              required
              className="rounded-xl h-11 border-border/60"
            />
          </div>

          {/* Body */}
          <div className="space-y-1.5">
            <Label htmlFor="body" className="text-sm font-medium text-espresso/70">Message</Label>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your message here…"
              required
              rows={10}
              className="rounded-xl border-border/60 resize-none"
            />
            <p className="text-[11px] text-espresso/40">Plain text. The backend sends this as the email body.</p>
          </div>

          <Button
            type="submit"
            disabled={sending || !subject.trim() || !body.trim()}
            className="w-full rounded-full h-11 bg-espresso text-cream hover:bg-espresso/90 gap-2 text-sm font-semibold"
          >
            {sending ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-cream/20 border-t-cream animate-spin" />
                Sending…
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send Campaign
              </>
            )}
          </Button>
        </form>

        {/* Result card */}
        {result && (
          <div className="mt-5 rounded-xl border border-matcha/30 bg-matcha/5 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Mail className="h-4 w-4 text-matcha-dark" />
              <span className="text-sm font-semibold text-matcha-dark">Campaign sent</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-espresso">{result.sent}</div>
                <div className="text-[11px] text-espresso/50">Delivered</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-espresso">{result.skipped}</div>
                <div className="text-[11px] text-espresso/50">Skipped</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-espresso">{result.invalid_emails.length}</div>
                <div className="text-[11px] text-espresso/50">Invalid</div>
              </div>
            </div>
            {result.invalid_emails.length > 0 && (
              <div className="mt-3 text-xs text-espresso/50">
                <span className="font-medium">Invalid addresses: </span>
                {result.invalid_emails.join(", ")}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
