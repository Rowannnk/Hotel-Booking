import { Rooms } from "@/app/models/room";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  const { id } = params; // Get roomId from params

  try {
    const room = await Rooms.findById(id);
    if (!room) {
      return NextResponse.json({ message: "Room not found" }, { status: 404 });
    }

    await Rooms.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "Room deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Room deletion error:", error);
    return NextResponse.json(
      { message: "Room deletion failed", error: error.message },
      { status: 400 }
    );
  }
}
