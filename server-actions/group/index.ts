import { prisma } from "@/lib/prisma";
import { Group } from "@prisma/client";

interface CreateGroupData {
  name: string;
  tokenCA: string;
  tokenName?: string;
  moderatorId: string;
  threshold: number;
}

export interface UpdateGroupData {
  name?: string;
  tokenCA?: string;
  tokenName?: string;
  threshold?: number;
}

export async function createGroup(data: CreateGroupData): Promise<Group> {
  try {
    return await prisma.group.create({
      data: {
        name: data.name,
        tokenCA: data.tokenCA,
        tokenName: data.tokenName || null,
        moderator: {
          connect: {
            id: data.moderatorId,
          },
        },
        threshold: data.threshold,
      },
    });
  } catch (error) {
    console.error("Error creating group", error);
    throw error;
  }
}

export async function getGroup(id: string): Promise<Group | null> {
  return await prisma.group.findUnique({
    where: { id },
    include: {
      members: {
        select: {
          id: true,
          wallet: true,
          twitterName: true,
          meetsThreshold: true,
          balance: true,
          lastChecked: true,
        }
      },
    },
  });
}

export async function getGroups(moderatorId: string): Promise<Group[]> {
  return await prisma.group.findMany({
    where: {
      moderatorId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      members: true,
    },
  });
}

export async function updateGroup(
  id: string,
  data: UpdateGroupData
): Promise<Group | null> {
  return await prisma.group.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.tokenCA && { tokenCA: data.tokenCA }),
      ...(data.tokenName !== undefined && { tokenName: data.tokenName }),
      ...(data.threshold !== undefined && { threshold: data.threshold }),
    },
  });
}

export async function deleteGroup(id: string): Promise<boolean> {
  try {
    await prisma.group.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    return false;
  }
}
