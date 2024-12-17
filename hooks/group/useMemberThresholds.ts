import { useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useToast } from "../use-toast";

interface ThresholdState {
  lastChecked: { [groupId: string]: string }; // Date string
  setLastChecked: (groupId: string) => void;
  canCheck: (groupId: string) => boolean;
}

export const useThresholdStore = create<ThresholdState>()(
  persist(
    (set, get) => ({
      lastChecked: {},
      setLastChecked: (groupId: string) =>
        set((state) => ({
          lastChecked: {
            ...state.lastChecked,
            [groupId]: new Date().toISOString(),
          },
        })),
      canCheck: (groupId: string) => {
        const lastCheck = get().lastChecked[groupId];
        if (!lastCheck) return true;

        const lastCheckDate = new Date(lastCheck);
        const today = new Date();
        return (
          lastCheckDate.getDate() !== today.getDate() ||
          lastCheckDate.getMonth() !== today.getMonth() ||
          lastCheckDate.getFullYear() !== today.getFullYear()
        );
      },
    }),
    {
      name: "threshold-storage",
    }
  )
);

export function useMemberThresholds(groupId: string) {
  const [isChecking, setIsChecking] = useState(false);
  const { canCheck, setLastChecked } = useThresholdStore();
  const { toast } = useToast();

  const checkThresholds = async (forceCheck: boolean = false) => {
    if (!canCheck(groupId) && !forceCheck) {
      toast({
        title: "Already Checked Today",
        description: "Threshold checks are limited to once per day",
      });
      return;
    }

    setIsChecking(true);
    try {
      const response = await fetch(`/api/groups/${groupId}/check-thresholds`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to check thresholds");

      setLastChecked(groupId);
      toast({
        title: "Success",
        description: "Member thresholds have been updated",
      });
      return await response.json();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check member thresholds",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  return {
    checkThresholds,
    isChecking,
    canCheckToday: canCheck(groupId),
  };
}
