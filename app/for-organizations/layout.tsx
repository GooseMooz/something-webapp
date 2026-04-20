import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'For Organizations',
  description:
    'Partner with Something to connect your Metro Vancouver organization with motivated young volunteers. Post opportunities, manage applications, and build your community impact.',
  alternates: {
    canonical: '/for-organizations',
  },
  openGraph: {
    title: 'For Organizations | Something',
    description:
      'Partner with Something to connect your Metro Vancouver organization with motivated young volunteers. Post opportunities, manage applications, and build your community impact.',
    url: '/for-organizations',
  },
}

export default function ForOrganizationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
