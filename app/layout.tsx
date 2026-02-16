import type { Metadata, Viewport } from "next";
import { Poppins, Cairo } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "600", "700", "800"],
  display: "swap",
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["latin", "arabic"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
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
      <body className={`${poppins.variable} ${cairo.variable}`}>
        {children}
        
        {/* Tawk.to Live Chat */}
        <Script
          id="tawk-to"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              (function(){
                var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                s1.async=true;
                s1.src='https://embed.tawk.to/69936a6f4e05cb1c38c593a4/1jhjtfh8r';
                s1.charset='UTF-8';
                s1.setAttribute('crossorigin','*');
                s0.parentNode.insertBefore(s1,s0);
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
