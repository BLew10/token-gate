"use client";

import { useCallback, useEffect, useState } from "react";

interface Group {
  id: string;
  name: string;
  tokenCA: string;
  tokenName: string | null;
  threshold: number;
  members: any[];
  createdAt: Date;
}

interface CreateGroupData {
  name: string;
  tokenCA: string;
  tokenName?: string;
}

interface UpdateGroupData {
  name?: string;
  tokenCA?: string;
  tokenName?: string;
}

interface GroupDetails {
  id: string;
  name: string;
  tokenCA: string;
  tokenName: string;
  threshold: number;
  members: any[];
  moderatorId: string;
}

export function useGroups(moderatorId?: string) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGroups() {
      if (!moderatorId) return;
      
      try {
        const response = await fetch(`/api/groups?moderatorId=${moderatorId}`);
        if (!response.ok) throw new Error('Failed to fetch groups');
        const data = await response.json();
        setGroups(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch groups');
      } finally {
        setIsLoading(false);
      }
    }

    fetchGroups();
  }, [moderatorId]);

  return { groups, isLoading, error };
}
