import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HW247 Admin Portal',
  description: 'Admin Portal for Order Management, Vendor Approval, Settlements & Returns',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
