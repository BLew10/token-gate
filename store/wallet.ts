import { create } from 'zustand';
import { Wallet } from '@/types/wallet';

interface WalletStore {
  wallet: Wallet | null;
  setWallet: (wallet: Wallet | null) => void;
  clearWallet: () => void;
}

export const useWalletStore = create<WalletStore>((set) => ({
  wallet: null,
  setWallet: (wallet) => set({ wallet }),
  clearWallet: () => set({ wallet: null }),
}));