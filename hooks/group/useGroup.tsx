"use client";

import { useCallback, useEffect, useState } from "react";
import { useToast } from "../use-toast";

interface Group {
  id: string;
  name: string;
  tokenCA: string;
  tokenName: string | null;
  createdAt: Date;
  members: any[];
  moderatorId: string;
  threshold: number;
  visibility: string;
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
  threshold?: number;
}

interface GroupDetails {
  id: string;
  name: string;
  tokenCA: string;
  tokenName: string;
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

export function useGroup(id?: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const createGroup = useCallback(
    async (data: CreateGroupData) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/groups", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error("Failed to create group");

        const group = await response.json();
        toast({ title: "Success", description: "Group created successfully" });
        return group;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to create group";
        setError(message);
        toast({ title: "Error", description: message, variant: "destructive" });
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  const [group, setGroup] = useState<GroupDetails | null>(null);

  useEffect(() => {
    if (id) {
      getGroup(id);
    }
  }, [id]);

  const getGroup = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/groups/${id}`);
      if (!response.ok) throw new Error("Failed to fetch group");
      const group = await response.json();
      setGroup(group);
      return group;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch group";
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      getGroup(id);
    }
  }, [id]);

  const updateGroup = useCallback(
    async (id: string, data: UpdateGroupData) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/groups/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error("Failed to update group");

        const group = await response.json();
        toast({ title: "Success", description: "Group updated successfully" });
        return group;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to update group";
        setError(message);
        toast({ title: "Error", description: message, variant: "destructive" });
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  const deleteGroup = useCallback(
    async (id: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/groups/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete group");

        toast({ title: "Success", description: "Group deleted successfully" });
        return true;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to delete group";
        setError(message);
        toast({ title: "Error", description: message, variant: "destructive" });
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  const getAllGroups = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/groups");
      if (!response.ok) throw new Error("Failed to fetch groups");
      const groups = await response.json();
      return groups;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch groups";
      setError(message);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMember = useCallback(
    async (groupId: string, memberId: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/groups/${groupId}/members?memberId=${memberId}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete member");
        const group = await response.json();
        toast({ title: "Success", description: "Member deleted successfully" });
        return group;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to delete member";
        setError(message);
        toast({ title: "Error", description: message, variant: "destructive" });
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  return {
    createGroup,
    updateGroup,
    deleteGroup,
    getAllGroups,
    isLoading,
    error,
    group,
    getGroup,
    deleteMember,
  };
}
