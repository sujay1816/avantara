import type { Metadata } from 'next'
import './globals.css'
import config from '@/config.json'

export const metadata: Metadata = {
  title: config.seo.defaultTitle,
  description: config.seo.defaultDescription,
  keywords: config.seo.defaultKeywords,
  openGraph: {
    title: config.seo.defaultTitle,
    description: config.seo.defaultDescription,
    images: [config.seo.ogImageUrl],
    siteName: config.brand.name,
  },
  twitter: {
    card: 'summary_large_image',
    site: config.seo.twitterHandle,
    title: config.seo.defaultTitle,
    description: config.seo.defaultDescription,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={config.store.language}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={config.theme.fontHeadingUrl} rel="stylesheet" />
        <link href={config.theme.fontBodyUrl} rel="stylesheet" />
        <style>{`
          :root {
            --color-primary: ${config.theme.primaryColor};
            --color-accent: ${config.theme.accentColor};
            --color-accent-dark: ${config.theme.accentDark};
            --color-text-primary: ${config.theme.textPrimary};
            --color-text-secondary: ${config.theme.textSecondary};
            --color-bg-primary: ${config.theme.backgroundPrimary};
            --color-bg-secondary: ${config.theme.backgroundSecondary};
            --color-border: ${config.theme.borderColor};
            --font-heading: '${config.theme.fontHeading}', serif;
            --font-body: '${config.theme.fontBody}', sans-serif;
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
