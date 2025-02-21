import type { Metadata } from "next";
import { Geist, Geist_Mono,Source_Code_Pro } from "next/font/google";
import "./globals.css";
import MainDashboard from "@/components/dashboard/main-dashboard";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sourceCode = Source_Code_Pro({
  variable: "--font-source-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mongoltori",
  description: "Mongoltori GUI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sourceCode.className} antialiased`}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
        <MainDashboard>
          {children}
        </MainDashboard>
        <Toaster/>
        </ThemeProvider>
       
      </body>
    </html>
  );
}
