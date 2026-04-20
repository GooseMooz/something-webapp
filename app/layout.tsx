import type { Metadata, Viewport } from 'next'
import { Lora, DM_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://somethingmatters.ca'

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-lora',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Something — Volunteer in Vancouver',
    template: '%s | Something',
  },
  description:
    'Find meaningful volunteer opportunities in Metro Vancouver. One-tap apply, track your impact, and do something that matters.',
  keywords: [
    'Vancouver volunteering',
    'volunteer Vancouver',
    'Something Vancouver',
    'Something Vancouver volunteering',
    'Metro Vancouver volunteer opportunities',
    'volunteer opportunities Vancouver BC',
    'youth volunteering Vancouver',
    'community volunteering Metro Vancouver',
    'volunteer app Vancouver',
  ],
  authors: [{ name: 'Something', url: siteUrl }],
  creator: 'Something',
  publisher: 'Something',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: siteUrl,
    siteName: 'Something',
    title: 'Something — Volunteer in Vancouver',
    description:
      'Find meaningful volunteer opportunities in Metro Vancouver. One-tap apply, track your impact, and do something that matters.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Something — Volunteer in Metro Vancouver',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Something — Volunteer in Vancouver',
    description:
      'Find meaningful volunteer opportunities in Metro Vancouver. One-tap apply, track your impact, and do something that matters.',
    images: ['/og-image.png'],
    creator: '@somethingmatters',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
}

export const viewport: Viewport = {
  themeColor: '#fefcf8',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'Something',
      description: 'Volunteer opportunities in Metro Vancouver',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${siteUrl}/app/opportunities?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'Something',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/icon.svg`,
      },
      sameAs: [],
      areaServed: {
        '@type': 'Place',
        name: 'Metro Vancouver, British Columbia, Canada',
      },
      description:
        'Something connects Metro Vancouver youth with meaningful volunteer opportunities.',
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${lora.variable} ${dmSans.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
