import { NextResponse } from "next/server";
import { createGroup, getGroups } from "@/server-actions/group";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const group = await createGroup(data);
    return NextResponse.json(group);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create group" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const moderatorId = searchParams.get('moderatorId');
    
    if (!moderatorId) {
      return NextResponse.json({ error: "Moderator ID is required" }, { status: 400 });
    }

    const groups = await getGroups(moderatorId);
    return NextResponse.json(groups);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch groups" },
      { status: 500 }
    );
  }
}