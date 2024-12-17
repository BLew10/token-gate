import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MembersTab } from "@/app/groups/[id]/(components)/members-tab";
import { SettingsTab } from "@/app/groups/[id]/(components)/settings-tab";
import { GroupDetails } from "@/types/group";

interface GroupTabsProps {
  group: GroupDetails;
  isChecking: boolean;
  onCheckThresholds: () => void;
  onAddMember: () => void;
  onDeleteMember: (memberId: string) => void;
  onUpdate: () => void;
}

export function GroupTabs({
  group,
  isChecking,
  onCheckThresholds,
  onAddMember,
  onDeleteMember,
  onUpdate,
}: GroupTabsProps) {
  return (
    <Tabs defaultValue="members" className="space-y-4">
      <TabsList>
        <TabsTrigger value="members">Members</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="members">
        <MembersTab
          group={group}
          isChecking={isChecking}
          onCheckThresholds={onCheckThresholds}
          onAddMember={onAddMember}
          onDeleteMember={onDeleteMember}
        />
      </TabsContent>

      <TabsContent value="settings">
        <SettingsTab group={group} onUpdate={onUpdate} />
      </TabsContent>
    </Tabs>
  );
} 