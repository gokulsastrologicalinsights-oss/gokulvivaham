import type { Metadata } from "next";
import { Poppins, Noto_Sans_Tamil } from "next/font/google";
import "./globals.css";

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
  openGraph: {
    title: "Gokul Vivaham — Premium Tamil Matrimony",
    description:
      "Find your perfect Tamil life partner on Gokul Vivaham — a premium, trusted Tamil matrimony platform.",
    type: "website",
    locale: "en_IN",
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
        {children}
      </body>
    </html>
  );
}
