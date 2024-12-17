export interface GroupDetails {
  id: string;
  name: string;
  tokenCA: string;
  tokenName: string | null;
  threshold: number;
  members: Array<{
    id: string;
    wallet: string;
    twitterName: string;
    meetsThreshold: boolean;
    balance: number | null;
    lastChecked: Date;
  }>;
  moderatorId: string;
  visibility: string;
} 