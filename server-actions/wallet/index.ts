"use server";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const getWallet = async (walletAddress: string) => {
  try {
    const wallet = await prisma.wallet.findUnique({
      where: {
        address: walletAddress,
      },
      include: {
        groups: {
          select: {
            id: true,
            name: true,
            tokenCA: true,
            tokenName: true,
          },
        },
        subGroups: {
          select: {
            id: true,
            name: true,
            tokenCA: true,
            tokenName: true,
          },
        },
      },
    });

    if (!wallet) {
      return NextResponse.json(null);
    }

    return wallet;
  } catch (error) {
    return null;
  }
};


export const createWallet = async (walletAddress: string) => {
  const wallet = await prisma.wallet.upsert({
    where: {
      address: walletAddress,
    },
    update: {}, // No updates if it exists
    create: {
      address: walletAddress,
    },
  });

  return wallet;
};