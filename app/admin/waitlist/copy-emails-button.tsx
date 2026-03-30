"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"

export function CopyEmailsButton({ emails }: { emails: string[] }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(emails.join("\n"))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 rounded-lg border border-[#e8ddd0] bg-[#f7f1e8] px-3 py-1.5 font-sans text-xs font-medium text-[#7a6651] transition-colors hover:border-[#c9b99a] hover:text-[#2c1f0e]"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied!" : "Copy all emails"}
    </button>
  )
}
