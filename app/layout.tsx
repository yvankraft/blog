import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/app/lib/db";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Les Talks",
  description: "A simple blog built with Next.js",
  verification: {
    other: {
      "tiktok-developers-site-verification": [
        "C418urr6NPyWSWcflGXR9ctgEi1p2zr0",
      ],
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  // Si l'utilisateur est connecté, on met à jour sa date d'activité en arrière-plan
  if (session?.user) {
    // Évite de saturer la DB à chaque clic : met à jour uniquement si la dernière activité a plus de 2 minutes
    const threshold = new Date(Date.now() - 2 * 60 * 1000);

    if (
      !session.user.lastActiveAt ||
      new Date(session.user.lastActiveAt) < threshold
    ) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { lastActiveAt: new Date() },
      });
    }
  }
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
