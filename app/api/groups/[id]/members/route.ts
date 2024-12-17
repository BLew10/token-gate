import { NextResponse } from "next/server";
import { addMember, removeMember } from "@/server-actions/member";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { walletAddress, twitterName } = await request.json();
    const member = await addMember(
      params.id,
      walletAddress,
      twitterName,
    );
    return NextResponse.json(member);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add member. User already exists." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get("memberId");

    if (!memberId) {
      return NextResponse.json(
        { error: "Member ID is required" },
        { status: 400 }
      );
    }

    await removeMember(params.id, memberId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to remove member" },
      { status: 500 }
    );
  }
}
