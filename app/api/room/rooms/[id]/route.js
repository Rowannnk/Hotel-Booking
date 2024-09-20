// pages/api/room/rooms/[roomid].js

import { Rooms } from "@/app/models/room"; // Adjust the import according to your setup
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { roomid } = params;

  try {
    const room = await Rooms.findById(roomid); // Adjust according to your database query method
    if (!room) {
      return NextResponse.json({ message: "Room not found" }, { status: 404 });
    }
    return NextResponse.json(room);
  } catch (error) {
    console.error("Error fetching room:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
