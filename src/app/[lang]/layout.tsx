import type { Metadata, Viewport } from "next";

import localFont from "next/font/local";
import { Dancing_Script } from "next/font/google";
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

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing-script",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "マインドフルネスアプリ", // HTMLからタイトルを設定
  description: "今日のマインドフルネス", // 適切な説明に変更
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  themeColor: "red",
};

export default function RootLayout({
  children,
  params: { lang },
}: Readonly<{ children: React.ReactNode; params: { lang: string } }>) {
  return (
    <html lang={lang} dir={lang}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${MPLUS1Code.variable} ${dancingScript.variable} antialiased`}
      >
        <Providers lang={lang}>{children}</Providers>
      </body>
    </html>
  );
}
