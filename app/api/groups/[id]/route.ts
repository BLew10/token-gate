import { NextResponse } from "next/server";
import { getGroup, updateGroup, deleteGroup } from "@/server-actions/group";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const group = await getGroup(params.id);
    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }
    return NextResponse.json(group);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch group" },
      { status: 500 }
    );
  }
}


export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const group = await updateGroup(params.id, data);
    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }
    return NextResponse.json(group);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update group" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const success = await deleteGroup(params.id);
    if (!success) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete group" },
      { status: 500 }
    );
  }
} 