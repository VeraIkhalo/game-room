import { NextResponse } from "next/server";
import { rooms } from "@/lib/rooms";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(
  _request: Request,
  context: RouteContext,
) {
  const { id } = await context.params;
  const room = rooms.find((item) => item.id === id);

  if (!room) {
    return NextResponse.json(
      { message: "Room not found" },
      { status: 404 },
    );
  }

  if (room.status === "offline") {
    return NextResponse.json(
      { message: "This room is offline" },
      { status: 400 },
    );
  }

  if (room.players >= room.maxPlayers) {
    return NextResponse.json(
      { message: "This room is full" },
      { status: 400 },
    );
  }

  room.players += 1;

  return NextResponse.json(room);
}