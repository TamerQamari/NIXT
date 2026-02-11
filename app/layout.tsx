import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "600", "700", "800"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 5.0,
  userScalable: true,
};

export const metadata: Metadata = {
  title: "Nixt Group | Digital Future",
  description: "Digital Innovation & Tech Group - Building the future with integrated software solutions & smart systems development",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/sahm_logo.png" as="image" />
        <link rel="preload" href="/LogoWithName.png" as="image" />
        <link rel="preload" href="/Asset 11.png" as="image" />
        <link rel="preload" href="/logo.webp" as="image" />
        <link rel="preload" href="/October.webp" as="image" />
        <link rel="preload" href="/IMS.png" as="image" />
      </head>
      <body className={poppins.variable}>
        {children}
      </body>
    </html>
  );
}
