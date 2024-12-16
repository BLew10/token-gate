"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"

export function NavigationMenu() {
  const pathname = usePathname()

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
                pathname === "/groups"
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              Groups
            </Link>
            <Link
              href="/members"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/members"
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              Members
            </Link>
            <Link
              href="/analytics"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/analytics"
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              Analytics
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline">Connect Wallet</Button>
        </div>
      </div>
    </header>
  )
}