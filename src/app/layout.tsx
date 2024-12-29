import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppThemeProvider } from "@/components/theme/wrapper";
import { StoreProvider } from "@/data/provider";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gas by Gas",
  description: "Gas distributor application for Outlets and Consumers",
  icons: [
    { rel: 'icon', type: 'image/x-icon', url: "/favicon.ico" }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>

        <StoreProvider>
          <AppThemeProvider>
            {children}
            <ToastContainer position="bottom-center" draggable stacked />
          </AppThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
