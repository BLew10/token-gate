"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // Ensure this utility exists
import { Shield } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css"; // Add wallet adapter styles globally
import { useWalletCustomHook } from "@/hooks/wallet/useWallet";

export function NavigationMenu() {
  const pathname = usePathname();
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            <span className="font-bold">Token Gate</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/groups"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname.startsWith("/groups")
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              Groups
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4 bg-gray-500 hover:bg-gray-600 rounded-md">
          <WalletMultiButton />
        </div>
      </div>
    </header>
  );
}
