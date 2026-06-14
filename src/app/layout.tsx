import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sendero del Héroe — Roguelite de Cartas",
  description: "Elige tu camino, evoluciona tus cartas y conquista al jefe final. Un roguelite de cartas con 3 ramas de evolución.",
  keywords: ["Sendero del Héroe", "roguelite", "cartas", "deckbuilder", "juego"],
  authors: [{ name: "Sendero del Héroe" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Sendero del Héroe",
    description: "Roguelite de cartas — Elige tu camino, evoluciona, conquista.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sendero del Héroe",
    description: "Roguelite de cartas — Elige tu camino, evoluciona, conquista.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
