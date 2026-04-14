import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from './context/AuthContext'

export const metadata: Metadata = {
  title: 'HW247 Admin Portal',
  description: 'Admin Portal for Order Management, Vendor Approval, Settlements & Returns',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
