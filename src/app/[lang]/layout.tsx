import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
  title: "Wecome Meditation",
  description: "provide someone with comfort",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${MPLUS1Code.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
