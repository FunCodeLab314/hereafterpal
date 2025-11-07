import './globals.css'
import { Poppins } from 'next/font/google'
import { ThemeProvider } from './theme-provider'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ToastProvider } from '@/components/ToastProvider'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-poppins',
})

export const metadata = {
  title: 'Hereafter, Pal',
  description: 'A digital memorial service.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable} suppressHydrationWarning>
      <body className="font-poppins">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ToastProvider />
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
