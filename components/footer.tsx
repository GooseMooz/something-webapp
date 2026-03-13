import Link from "next/link"
import { Sparkles, Heart } from "lucide-react"

const footerLinks = {
  Platform: [
    { label: "Browse Opportunities", href: "/opportunities" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "For Organizations", href: "/for-organizations" },
  ],
  Company: [
    { label: "Our Story", href: "/our-story" },
    { label: "Contact", href: "mailto:hello@something.community" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-latte/60">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-espresso text-cream">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <span className="font-serif font-semibold text-lg text-espresso">Something</span>
            </Link>
            <p className="font-serif text-sm italic leading-relaxed text-espresso/60">
              Connecting Metro Vancouver youth with meaningful volunteer opportunities.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="flex flex-col gap-3">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-espresso/40">{title}</h4>
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="font-serif text-sm text-espresso/55 transition-colors hover:text-espresso"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-2 border-t border-border/40 pt-6 text-center font-serif text-sm italic text-espresso/40 md:flex-row md:justify-between">
          <p>© 2026 Something. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Made with <Heart className="h-3 w-3 fill-rose text-rose" /> in Vancouver
          </p>
        </div>
      </div>
    </footer>
  )
}
