import { NextResponse } from "next/server";
import { createWallet, getWallet } from "@/server-actions/wallet";

export async function POST(request: Request) {
  try {
    const { walletAddress } = await request.json();

    const wallet = await createWallet(walletAddress);

    if (wallet) {
      const walletInfo = await getWallet(walletAddress);
      return NextResponse.json(wallet);
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create wallet" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { publicKey: string } }
) {
  try {
    const wallet = await getWallet(params.publicKey);

    return NextResponse.json(wallet);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch wallet" },
      { status: 500 }
    );
  }
}
