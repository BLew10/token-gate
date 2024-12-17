import { NextResponse } from "next/server";
export interface Token {
    name: string;
    ca: string;
}

export async function GET(request: Request, { params }: { params: { ca: string } }) {

    try {
        const ca = params.ca;
        const response = await fetch(`https://solana-gateway.moralis.io/token/mainnet/${ca}/metadata`, {
            headers: {
                "accept": "application/json",
                "X-API-Key": process.env.MORALIS_API_KEY || '',
            },
        });
        const data = await response.json();

        const token: Token = {
            name: data.name,
            ca: data.mint,
        };
        return NextResponse.json(token);
    } catch (error) {
        console.error("Error fetching token price", error);
        return NextResponse.json({ error: "Failed to fetch token price" }, { status: 500 });
    }
}