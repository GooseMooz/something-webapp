import Link from "next/link"
import { Sparkles, Heart } from "lucide-react"

const footerLinks = {
  Platform: [
    { label: "Opportunities", href: "/opportunities" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "For Organizations", href: "/signup" },
  ],
  Company: [
    { label: "Our Story", href: "/our-story" },
    { label: "Contact", href: "#" },
    { label: "Blog", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-latte">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-matcha text-espresso">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-lg font-extrabold text-espresso">
                Something
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-espresso/70">
              Connecting Metro Vancouver youth with meaningful volunteer
              opportunities. Do something that matters.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="flex flex-col gap-3">
              <h4 className="text-sm font-bold text-espresso">{title}</h4>
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-espresso/60 transition-colors hover:text-espresso"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-2 border-t border-border pt-6 text-center text-sm text-espresso/50 md:flex-row md:justify-between">
          <p>2026 Something. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="h-3.5 w-3.5 fill-matcha text-matcha" /> in Vancouver
          </p>
        </div>
      </div>
    </footer>
  )
}
