import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import ClientWalletProvider from "@/components/wallet-provider";
import { Toaster } from "@/components/ui/toaster";
import { NavigationMenu } from "@/components/navigation-menu";
import "@solana/wallet-adapter-react-ui/styles.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Token-Gated Community",
  description: "Manage your token-gated Solana communities",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-gray-100`}>
        <ClientWalletProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <NavigationMenu />
            <main className="container mx-auto px-4 pt-4">
              {children}
            </main>
            <Toaster />
          </ThemeProvider>
        </ClientWalletProvider>
      </body>
    </html>
  );
}
