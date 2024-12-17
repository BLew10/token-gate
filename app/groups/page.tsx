"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Users } from "lucide-react";
import { useGroups } from "@/hooks/group/useGroups";
import { useWalletCustomHook } from "@/hooks/wallet/useWallet";
import Link from "next/link";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

interface Group {
  id: string;
  name: string;
  tokenCA: string;
  tokenName: string | null;
  threshold: number;
  members: any[];
}

export default function GroupsPage() {
  const { wallet } = useWalletCustomHook();

  const { groups, isLoading, error } = useGroups(wallet?.id);
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Groups</h1>
          <p className="text-muted-foreground">
            Manage your token-gated communities and their members
          </p>
        </div>
        {wallet && (
          <Button asChild>
            <Link href="/groups/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Group
            </Link>
          </Button>
        )}
      </div>
      {!wallet && (
          <p className="text-center w-full text-muted-foreground">
            Please connect your wallet to create a group
          </p>
        )}
      <div className="grid md:grid-cols-3 gap-6">
        {groups.map((group: Group) => (
          <Card key={group.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {group.name}
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-4">
                {group?.members?.length || 0} members
              </div>
              <p className="text-xs text-muted-foreground">
                Token threshold: {group.threshold}
              </p>
              <div className="mt-4">
                <Button variant="secondary" className="w-full" asChild>
                  <Link href={`/groups/${group.id}`}>View Details</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
