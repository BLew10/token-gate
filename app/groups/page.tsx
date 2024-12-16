import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Users } from "lucide-react"
import Link from "next/link"

export default function GroupsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Groups</h1>
          <p className="text-muted-foreground">
            Manage your token-gated communities and their members
          </p>
        </div>
        <Button asChild>
          <Link href="/groups/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Group
          </Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Solana Developers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142 members</div>
            <p className="text-xs text-muted-foreground">
              Token threshold: 100 SOL
            </p>
            <div className="mt-4">
              <Button variant="secondary" className="w-full" asChild>
                <Link href="/groups/1">View Details</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Add more example groups here */}
      </div>
    </div>
  )
}