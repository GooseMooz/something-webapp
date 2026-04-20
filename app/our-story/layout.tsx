import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Story',
  description:
    'Something was built in Metro Vancouver to connect young people with volunteer opportunities that actually matter. Learn why we started and what drives us.',
  alternates: {
    canonical: '/our-story',
  },
  openGraph: {
    title: 'Our Story | Something',
    description:
      'Something was built in Metro Vancouver to connect young people with volunteer opportunities that actually matter. Learn why we started and what drives us.',
    url: '/our-story',
  },
}

export default function OurStoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
