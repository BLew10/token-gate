"use server";

import { prisma } from "@/lib/prisma";

export async function addMember(
  groupId: string,
  walletAddress: string,
  twitterName: string
) {
  return await prisma.member.create({
    data: {
      wallet: walletAddress,
      twitterName,
      group: {
        connect: {
          id: groupId,
        },
      },
    },
  });
}

export async function removeMember(groupId: string, memberId: string) {
  return await prisma.member.delete({
    where: {
      id: memberId,
      groupId,
    },
  });
}

export async function checkMemberThresholds(groupId: string) {
  const group = await prisma.group.findUnique({
    where: { id: groupId },
    include: { members: true },
  });

  if (!group) throw new Error("Group not found");

  const updatedMembers = await Promise.all(
    group.members.map(async (member) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/molaris/wallet/${member.wallet}/`,
          { method: "GET" }
        );

        const tokens = await response.json();
        // Handle empty response
        if (!Array.isArray(tokens) || tokens.length === 0) {
          return await prisma.member.update({
            where: { id: member.id },
            data: {
              meetsThreshold: false,
              balance: 0,
              lastChecked: new Date(),
            },
          });
        }

        const groupToken = tokens.find(
          (token: any) => token.mint === group.tokenCA
        );
        const balance = groupToken ? parseFloat(groupToken.amount) : 0;
        const meetsThreshold = balance >= group.threshold;

        return await prisma.member.update({
          where: { id: member.id },
          data: {
            meetsThreshold,
            balance,
            lastChecked: new Date(),
          },
        });
      } catch (error) {
        console.error(`Failed to check member ${member.id}:`, error);
        // Update with zero balance on error
        return await prisma.member.update({
          where: { id: member.id },
          data: {
            meetsThreshold: false,
            balance: 0,
            lastChecked: new Date(),
          },
        });
      }
    })
  );

  return updatedMembers;
}
