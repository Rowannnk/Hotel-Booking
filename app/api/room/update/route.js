import { Users } from "@/app/models/user";
import { Rooms } from "@/app/models/room";
import { NextResponse } from "next/server";

export async function PUT(request) {
  const body = await request.json();
  const {
    userId,
    roomId,
    name,
    maxpeople,
    phonenumber,
    rentperday,
    imgurls,
    roomtype,
    description,
  } = body;

  try {
    const room = await Rooms.findById(roomId);
    if (!room) {
      return NextResponse.json({ message: "Room not found" }, { status: 404 });
    }

    if (name) room.name = name;
    if (maxpeople) room.maxpeople = maxpeople;
    if (phonenumber) room.phonenumber = phonenumber;
    if (rentperday) room.rentperday = rentperday;
    if (imgurls && imgurls.length > 0) room.imgurls = imgurls;
    if (roomtype) room.roomtype = roomtype;
    if (description) room.description = description;

    await room.save();

    return NextResponse.json(
      { message: "Room updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Room update error:", error);
    return NextResponse.json(
      { message: "Room update failed", error: error.message },
      { status: 400 }
    );
  }
}
