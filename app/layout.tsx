import type { Metadata } from "next";
import { Poppins, Noto_Sans_Tamil } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const notoSansTamil = Noto_Sans_Tamil({
  variable: "--font-tamil",
  subsets: ["tamil"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gokulvivaham.com"),
  title: "Gokul Vivaham — Premium Tamil Matrimony",
  description:
    "Find your perfect Tamil life partner on Gokul Vivaham — a premium, trusted Tamil matrimony platform connecting hearts across the globe. Browse verified profiles and discover your soulmate.",
  keywords: [
    "Tamil matrimony",
    "Tamil marriage",
    "Tamil brides",
    "Tamil grooms",
    "Gokul Vivaham",
    "Tamil wedding",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Gokul Vivaham — Premium Tamil Matrimony",
    description:
      "Find your perfect Tamil life partner on Gokul Vivaham — a premium, trusted Tamil matrimony platform.",
    url: "https://gokulvivaham.com",
    siteName: "Gokul Vivaham",
    images: [
      {
        url: "/og-image.jpg", // We would need a real image here
        width: 1200,
        height: 630,
        alt: "Gokul Vivaham - Premium Tamil Matrimony",
      },
    ],
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gokul Vivaham — Premium Tamil Matrimony",
    description: "Find your perfect Tamil life partner on Gokul Vivaham.",
    images: ["/og-image.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Gokul Vivaham",
  url: "https://gokulvivaham.com",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://gokulvivaham.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ta"
      className={`${poppins.variable} ${notoSansTamil.variable}`}
    >
      <body className="min-h-screen bg-ivory-100 font-[family-name:var(--font-poppins)] antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
