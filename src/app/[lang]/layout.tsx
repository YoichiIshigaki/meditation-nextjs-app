import type { Metadata, Viewport } from "next";

import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "../../components/wrapper/Providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const MPLUS1Code = localFont({
  src: "./fonts/MPLUS1Code-Regular.ttf",
  variable: "--m-plus-1code",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "マインドフルネスアプリ", // HTMLからタイトルを設定
  description: "今日のマインドフルネス", // 適切な説明に変更
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1,
  userScalable: false,
  themeColor: "red",
};

export default function RootLayout({
  children,
  params: { lang },
}: Readonly<{ children: React.ReactNode; params: { lang: string } }>) {
  return (
    <html lang={lang} dir={lang}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${MPLUS1Code.variable} antialiased`}
      >
        <Providers lang={lang}>{children}</Providers>
      </body>
    </html>
  );
}
