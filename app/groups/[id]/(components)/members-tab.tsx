import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusIcon, TrashIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { RefreshCcw, Loader2, Copy } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { formatNumber } from "@/lib/utils";
import { GroupDetails } from "@/types/group";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface MembersTabProps {
  group: GroupDetails;
  isChecking: boolean;
  onCheckThresholds: () => void;
  onAddMember: () => void;
  onDeleteMember: (memberId: string) => void;
}

export function MembersTab({ group, isChecking, onCheckThresholds, onAddMember, onDeleteMember }: MembersTabProps) {
  const [members, setMembers] = useState(group.members);

  // Sort members: non-meeting members first, then alphabetically by wallet
  const sortedMembers = [...members].sort((a, b) => {
    if (a.meetsThreshold === b.meetsThreshold) {
      return a.wallet.localeCompare(b.wallet);
    }
    return a.meetsThreshold ? 1 : -1;
  });

  const handleDeleteMember = async (memberId: string) => {
    try {
      await onDeleteMember(memberId);
      // Update local state after successful deletion
      setMembers(current => current.filter(member => member.id !== memberId));
    } catch (error) {
      console.error("Failed to delete member:", error);
    }
  };

  // Update local state when group prop changes
  useEffect(() => {
    setMembers(group.members);
  }, [group.members]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Members</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCheckThresholds} disabled={isChecking}>
            {isChecking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking
              </>
            ) : (
              <>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Check Thresholds
              </>
            )}
          </Button>
          <Button onClick={onAddMember}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Wallet</TableHead>
              <TableHead>Twitter</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead className="text-right">Actions</TableHead>
              <TableHead className="text-right">Meets Threshold</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedMembers.map((member: any, index: number) => (
              <TableRow 
                key={member.id}
                className={cn(
                  index % 2 === 0 ? "bg-background" : "bg-muted/50",
                  !member.meetsThreshold && "border-l-2 border-l-destructive"
                )}
              >
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="flex items-center gap-2 font-mono">
                        <span>{member.wallet.slice(0, 4)}...{member.wallet.slice(-4)}</span>
                        <Copy 
                          className="h-4 w-4 cursor-pointer hover:text-muted-foreground" 
                          onClick={() => {
                            navigator.clipboard.writeText(member.wallet);
                            toast({
                              title: "Copied!",
                              description: "Wallet address copied to clipboard",
                            });
                          }}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{member.wallet}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>
                  <a
                    href={`https://x.com/${member.twitterName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    @{member.twitterName}
                  </a>
                </TableCell>
                <TableCell>{member.balance ? formatNumber(member.balance) : '-'}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDeleteMember(member.id)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </TableCell>
                <TableCell className="text-right flex items-center justify-end">
                  {member.meetsThreshold ? (
                    <CheckIcon className="h-6 w-6 text-green-500" />
                  ) : (
                    <XMarkIcon className="h-6 w-6 text-destructive" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
} 