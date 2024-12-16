import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Users, Wallet } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Token-Gated Community Control
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Create and manage token-gated communities on Solana with advanced member management,
          real-time token balance verification, and comprehensive analytics.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <Shield className="w-10 h-10 mb-3 text-primary" />
            <CardTitle>Token Gatekeeping</CardTitle>
            <CardDescription>
              Set token thresholds and automatically verify member compliance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Real-time balance verification</li>
              <li>• Multiple token support</li>
              <li>• Automated compliance checks</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Users className="w-10 h-10 mb-3 text-primary" />
            <CardTitle>Member Management</CardTitle>
            <CardDescription>
              Comprehensive tools for managing community members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Batch member imports</li>
              <li>• Role-based access control</li>
              <li>• Member flagging system</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Wallet className="w-10 h-10 mb-3 text-primary" />
            <CardTitle>Blockchain Integration</CardTitle>
            <CardDescription>
              Seamless integration with Solana blockchain
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• SPL token support</li>
              <li>• Multi-wallet tracking</li>
              <li>• Real-time updates</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <Button asChild size="lg">
          <Link href="/groups">Get Started</Link>
        </Button>
      </div>
    </main>
  )
}