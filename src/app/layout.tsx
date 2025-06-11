import type { Metadata } from 'next'
import { Urbanist } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { clsx } from 'clsx'
import { PrismicPreview } from "@prismicio/next";
import { createClient, repositoryName } from "@/prismicio";

const urbanist = Urbanist({ subsets: ['latin'] })

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const settings = await client.getSingle("settings");

  return {
    title: settings.data.meta_title,
    description: settings.data.meta_description,
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className='bg-slate-900 text-slate-200'>
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3754675341813777"
             crossOrigin="anonymous"></script>
        <script async custom-element="amp-auto-ads"
                src="https://cdn.ampproject.org/v0/amp-auto-ads-0.1.js">
        </script>
        <meta name="google-adsense-account" content="ca-pub-3754675341813777"></meta>
      </head>
      <body className={clsx(urbanist.className, "relative min-h-screen")}>
        <div 
          data-amp-auto-ads 
          data-ad-client="ca-pub-3754675341813777"
          style={{ display: 'none' }}
        />
        <Header/>
        {children}
        <div className="absolute inset-0 -z-50 max-h-screen
        background-gradient"></div>
        <div className="absolute pointer-events-none inset-0
        -z-40 h-full bg-[url('/noisetexture.jpg')]
        opacity-10 mix-blend-soft-light"></div>
        <Footer/>
        <PrismicPreview repositoryName={repositoryName} />
        {/* <div className="h-[500vh]"></div> */}
      </body>
    </html>
  )
}
