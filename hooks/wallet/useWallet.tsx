"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { useWalletStore } from "@/store/wallet";
import { useRouter, usePathname } from "next/navigation";
import Cookies from 'js-cookie';

export function useWalletCustomHook() {
  const { connected, publicKey } = useWallet();
  const { wallet, setWallet, clearWallet } = useWalletStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsConnected(connected && publicKey !== null);
    if (!connected || !publicKey) {
      clearWallet();
      Cookies.remove('wallet');
      if (pathname !== '/' && pathname !== '/groups') {
        router.push("/");
      }
    } else {
      Cookies.set('wallet', publicKey.toString());
    }
  }, [connected, publicKey, clearWallet, router, pathname]);

  useEffect(() => {
    async function createWallet() {
      if (!connected || !publicKey) {
        clearWallet();
        return;
      }

      // If wallet info is already in store, don't create again
      if (wallet?.address === publicKey.toString()) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/wallet/${publicKey.toString()}`, {
          method: "POST",
          body: JSON.stringify({
            walletAddress: publicKey.toString(),
          }),
        });
        if (!response.ok) {
          throw new Error('Failed to create wallet');
        }
        const data = await response.json();
        setWallet(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        clearWallet();
      } finally {
        setIsLoading(false);
      }
    }

    createWallet();
  }, [connected, publicKey, wallet, setWallet, clearWallet]);

  return {
    wallet,
    isLoading,
    error,
    publicKey,
    isConnected,
    isWallet: Boolean(wallet),
  };
}