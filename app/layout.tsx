import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import MainDashboard from "@/components/dashboard/main-dashboard";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import ReduxWrapper from "@/redux /redux-wrapper/redux-wrapper";


const sourceCode = localFont({
  src: [
    {
      path: "../public/fonts/SourceCodePro-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/SourceCodePro-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    // Add other weights/styles as needed
  ],
  variable: "--font-source-code",
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${sourceCode.className} antialiased`}>
        <ReduxWrapper>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <MainDashboard>
              {children}
              <Toaster />
            </MainDashboard>
          </ThemeProvider>
        </ReduxWrapper>
      </body>
    </html>
  );
}