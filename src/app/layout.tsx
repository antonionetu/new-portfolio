import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  icons: {
    icon: [
      {
        url: "/images/icon-dark.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/images/icon-light.png",
        media: "(prefers-color-scheme: light)",
      },
    ],
  },
  title: "Antonio Santana | Software Developer",
  description:
    "Full Stack Developer specializing in C#, .NET, Python, Django, React, Vue, Angular, AWS and more. Based in Aracaju, Brazil.",
  keywords: [
    "Antonio Santana",
    "Software Developer",
    "Full Stack",
    "C#",
    ".NET",
    "React",
    "Next.js",
    "Python",
    "Django",
    "AWS",
  ],
  openGraph: {
    title: "Antonio Santana | Software Developer",
    description:
      "Full Stack Developer specializing in C#, .NET, Python, Django, React, Vue, Angular, AWS and more.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="font-sans">{children}</body>
    </html>
  );
}
