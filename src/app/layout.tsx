import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "e-Vitals | Remote Patient Monitoring",
  description: "eVitals RPM documentation - Find the guidance you need, fast.",
  authors: [{ name: "e-Vitals" }],
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "e-Vitals | Remote Patient Monitoring",
    description: "eVitals RPM documentation - Find the guidance you need, fast.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
