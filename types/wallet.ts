export interface Wallet {
    id: string;
    address: string;
    createdAt: Date;
    groups: Array<{
      id: string;
      name: string;
      tokenCA: string;
      tokenName: string | null;
    }>;
    subGroups: Array<{
      id: string;
      name: string;
      tokenCA: string;
      tokenName: string | null;
    }>;
  }