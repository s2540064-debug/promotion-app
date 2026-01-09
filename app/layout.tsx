import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Serif_JP } from "next/font/google";
import "./globals.css";
import { MarketProvider } from "./contexts/MarketContext";
import { CompanyProvider } from "./contexts/CompanyContext";
import InvestmentNotificationManager from "./components/InvestmentNotificationManager";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSerif = Noto_Serif_JP({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "PROMOTION - 人間市場ゲーム",
  description: "自分の市場価値を競う人間市場ゲーム。投資とIRで時価総額を上げよう",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSerif.variable} antialiased`}
      >
        <MarketProvider>
          <CompanyProvider>
            <InvestmentNotificationManager />
            {children}
          </CompanyProvider>
        </MarketProvider>
      </body>
    </html>
  );
}
