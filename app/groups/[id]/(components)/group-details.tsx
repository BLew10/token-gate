"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useGroup } from "@/hooks/group/useGroup";
import { useMemberThresholds } from "@/hooks/group/useMemberThresholds";
import { GroupHeader } from "@/app/groups/[id]/(components)/group-header";
import { GroupTabs } from "@/app/groups/[id]/(components)/group-tabs";
import { GroupSkeleton } from "@/app/groups/[id]/(components)/group-skeleton";
import { AddMemberModal } from "@/app/groups/[id]/(components)/add-member-modal";
import { useWalletCustomHook } from "@/hooks/wallet/useWallet";

export default function GroupDetails() {
  const params = useParams();
  const router = useRouter();
  const { group, isLoading, getGroup, deleteMember } = useGroup(
    params.id as string
  );

  const { wallet } = useWalletCustomHook();
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  const { checkThresholds, isChecking } = useMemberThresholds(group?.id || "");

  const handleCheckThresholds = async () => {
    await checkThresholds(true);
    getGroup(group?.id || "");
  };

  const handleDeleteMember = async (memberId: string) => {
    await deleteMember(group?.id || "", memberId);
  };

  const handleUpdateGroup = async () => {
    await getGroup(group?.id || "");
  };

  if (isLoading) {
    return <GroupSkeleton />;
  }

  if (!group) {
    return <div>Group not found</div>;
  }

  if (wallet?.id !== group.moderatorId) {
    return <div>You are not the moderator of this group</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <GroupHeader group={group} router={router} />
      <GroupTabs
        group={group}
        isChecking={isChecking}
        onCheckThresholds={handleCheckThresholds}
        onAddMember={() => setIsAddMemberOpen(true)}
        onDeleteMember={handleDeleteMember}
        onUpdate={handleUpdateGroup}
      />
      <AddMemberModal
        groupId={group.id}
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        onSuccess={handleCheckThresholds}
      />
    </div>
  );
}
