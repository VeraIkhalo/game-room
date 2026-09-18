import { NextResponse } from "next/server";
import { rooms } from "@/lib/rooms";

export function GET() {
  return NextResponse.json(rooms);
}