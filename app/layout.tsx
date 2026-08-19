import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { QueryProvider } from "@/components/query-provider";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { LiquidDistortionDefs } from "@/components/ui/LiquidDistortionDefs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tsivot Hachem — Suivi d'habitudes",
  description: "Machiah est devant toi, suivre tes habitudes permet de marcher sur le chemin d'atteinte à la vision du Machiah, l'extrême bonté divine, avec cette appli simple d'utlisation, tu eux réaliser des choses extrêment grandes sur la durée.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon-180x180.png",
  },
  // themeColor: "#ffffff",
};

export const dynamic = 'force-dynamic'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <QueryProvider>
            <LiquidDistortionDefs />
            {children}
            <Toaster richColors position="top-center" />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}





// Dans ton layout ou ton App, rendu une seule fois
// export function GlassFilters() {
//   return (
//     <svg width="0" height="0" className="absolute">
//       <defs>
//         {/* Filtre de distorsion “liquide” */}
//         <filter id="liquid-distortion">
//           <feTurbulence
//             type="fractalNoise"
//             baseFrequency="0.6"
//             numOctaves="2"
//             result="noise"
//           />
//           <feDisplacementMap
//             in="SourceGraphic"
//             in2="noise"
//             scale="4"
//             xChannelSelector="R"
//             yChannelSelector="G"
//           />
//         </filter>
//       </defs>
//     </svg>
//   );
// }
