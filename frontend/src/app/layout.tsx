import type { Metadata } from "next";
import { Alfa_Slab_One, Special_Elite, Inter } from "next/font/google";
import "./globals.css";

const displaySlab = Alfa_Slab_One({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

const typewriter = Special_Elite({
  variable: "--font-stamp",
  weight: "400",
  subsets: ["latin"],
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Listing Intake — Real Estate Video Generator",
  description:
    "Submit a property listing and get back a branded walkthrough video.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${displaySlab.variable} ${typewriter.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
