import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/utils";
import { GroupDetails } from "@/types/group";

interface GroupHeaderProps {
  group: GroupDetails;
  router: any;
}

export function GroupHeader({ group }: GroupHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{group.name}</h1>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="default">{group.tokenName || group.tokenCA}</Badge>
          <Badge variant="outline">
            {formatNumber(group.threshold)} tokens
          </Badge>
        </div>
      </div>
    </div>
  );
} 