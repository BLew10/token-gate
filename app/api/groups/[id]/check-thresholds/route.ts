import { NextResponse } from "next/server";
import { checkMemberThresholds } from "@/server-actions/member";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const updatedMembers = await checkMemberThresholds(params.id);
    return NextResponse.json(updatedMembers);
  } catch (error) {
    console.error("Error checking thresholds:", error);
    return NextResponse.json(
      { error: "Failed to check thresholds" },
      { status: 500 }
    );
  }
} 