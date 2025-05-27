import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { ThemeProvider } from "@/components/theme-provider"
import { AppDataProvider } from "@/context/AppDataContextType ";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cofen",
  description: "Sistema de gestão de filas e agendamentos",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({children}: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          <main>
            <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
              <div className="flex">  
                <Sidebar />     
                <div className="p-5 w-full md:max-w-[1140px]">
                  <AppDataProvider>
                    {children}
                  </AppDataProvider>
                </div>
              </div>
          </ThemeProvider>
          </main>
      </body>
    </html>
  );
}
