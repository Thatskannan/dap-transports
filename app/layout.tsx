import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import NavBar from "@/components/NavBar";
import AuthGuard from "@/components/AuthGuard";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "700"],
});
const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "DAP Transports",
  description: "Trip ledger and reports for DAP Transports",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <NavBar />
        <main className="max-w-5xl mx-auto px-5 py-8">
          <AuthGuard>{children}</AuthGuard>
        </main>
      </body>
    </html>
  );
}
