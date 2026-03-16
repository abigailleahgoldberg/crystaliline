import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SessionWrapper from "@/components/SessionWrapper";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Crystaliline — The Modern Modding Tool for OG Fortnite",
  description:
    "More customizability. More control. More power. The modern modding tool for OG Fortnite servers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  );
}
