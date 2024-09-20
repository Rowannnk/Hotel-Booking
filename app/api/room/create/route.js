import { Users } from "@/app/models/user";
import { Rooms } from "@/app/models/room";
import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json();
  const {
    userId,
    name,
    maxpeople,
    phonenumber,
    rentperday,
    imgurls,
    roomtype,
    description,
  } = body;

  try {
    // Uncomment and check if the user exists and is an admin
    /*
    const user = await Users.findById(userId);
    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { message: "Unauthorized: Only admins can create rooms" },
        { status: 403 }
      );
    }
    */

    // Create a new room
    const newRoom = new Rooms({
      name,
      maxpeople,
      phonenumber,
      rentperday,
      imgurls,
      roomtype,
      description,
    });

    // Save the new room to the database
    await newRoom.save();
    return NextResponse.json(
      { message: "Room created successfully", room: newRoom },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating room:", error);
    return NextResponse.json(
      { message: "Room creation failed", error: error.message },
      { status: 400 }
    );
  }
}
