import type { Metadata } from "next";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import { Nav } from "@/components/nav";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});
const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "BDH Lab — Interactive Research Platform for Post-Transformer AI",
  description:
    "An interactive inspector, explainer, and benchmark dashboard for post-transformer, sparse-neuron architectures.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border py-10 mt-24">
          <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-muted">
            <p>
              BDH Lab is a scaffold built for demonstration. Numbers labeled{" "}
              <span className="text-amber">synthetic demo data</span> are not measurements of a real model.
            </p>
            <p className="font-mono text-xs">v0.1.0-scaffold</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
