"use client"

import { useState } from "react"
import { Send, Loader2, Check, AlertCircle } from "lucide-react"

type LaunchResult = {
  sent: number
  skipped: number
  invalid_emails: string[]
}

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; result: LaunchResult }
  | { status: "error"; message: string }

export function LaunchEmailButton({ count }: { count: number }) {
  const [state, setState] = useState<State>({ status: "idle" })

  async function handleLaunch() {
    if (state.status === "loading") return

    const confirmed = window.confirm(
      `Send the launch notification email to all ${count} waitlist ${count === 1 ? "person" : "people"}?`
    )
    if (!confirmed) return

    setState({ status: "loading" })
    try {
      const res = await fetch("/api/campaigns/launch", { method: "POST" })
      const data = await res.json()
      if (!res.ok) {
        setState({ status: "error", message: data.error ?? "Something went wrong" })
        return
      }
      setState({ status: "success", result: data as LaunchResult })
    } catch {
      setState({ status: "error", message: "Network error — please try again" })
    }
  }

  if (state.status === "success") {
    return (
      <div className="flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 font-sans text-xs font-medium text-green-700">
        <Check className="h-3.5 w-3.5" />
        Sent {state.result.sent}
        {state.result.skipped > 0 && `, skipped ${state.result.skipped}`}
      </div>
    )
  }

  if (state.status === "error") {
    return (
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1 font-sans text-xs text-red-600">
          <AlertCircle className="h-3.5 w-3.5" />
          {state.message}
        </span>
        <button
          onClick={() => setState({ status: "idle" })}
          className="font-sans text-xs text-[#a07850] underline underline-offset-2"
        >
          Dismiss
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleLaunch}
      disabled={state.status === "loading"}
      className="flex items-center gap-1.5 rounded-lg border border-[#c9b99a] bg-[#2c1f0e] px-3 py-1.5 font-sans text-xs font-medium text-[#fefcf8] transition-colors hover:bg-[#3d2c18] disabled:opacity-60"
    >
      {state.status === "loading" ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Send className="h-3.5 w-3.5" />
      )}
      {state.status === "loading" ? "Sending…" : "Send launch email"}
    </button>
  )
}
