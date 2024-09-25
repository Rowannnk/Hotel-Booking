import { NextResponse } from "next/server";
import { Rooms } from "@/app/models/room"; // Adjust the import path according to your setup

export async function GET(req, { params }) {
  const { id } = params; // Extract room ID from the params

  try {
    const room = await Rooms.findById(id); // Fetch room by ID from the database
    if (!room) {
      return NextResponse.json({ message: "Room not found" }, { status: 404 });
    }
    return NextResponse.json(room); // Return the room details as JSON
  } catch (error) {
    console.error("Error fetching room:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
