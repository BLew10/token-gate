import { NextResponse } from "next/server";
import MoralisInstance from "@/lib/moralis";

export async function GET(
  request: Request,
  { params }: { params: { address: string } }
) {
  try {
    const moralis = await MoralisInstance.getInstance();
    const response = await moralis.SolApi.account.getSPL({
      network: "mainnet",
      address: params.address,
    });

    if (!response?.raw) {
      return NextResponse.json([]);
    }

    return NextResponse.json(response.raw);
  } catch (e) {
    console.error("Moralis error:", e);
    return NextResponse.json([], { status: 200 });
  }
}