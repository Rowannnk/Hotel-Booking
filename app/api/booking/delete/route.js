import { Bookings } from "@/app/models/booking";
import { Rooms } from "@/app/models/room";
import dbConnect from "@/libs/mongodb";
import mongoose from "mongoose";

export async function DELETE(req) {
  try {
    const { bookingid, roomid } = await req.json(); // Extract bookingid and roomid from the request body

    // Validate ObjectId format
    if (
      !bookingid ||
      !roomid ||
      !mongoose.isValidObjectId(bookingid) ||
      !mongoose.isValidObjectId(roomid)
    ) {
      return new Response(
        JSON.stringify({
          message: "Valid Booking ID and Room ID are required.",
        }),
        { status: 400 }
      );
    }

    await dbConnect();

    // Find the booking by ID and delete it
    const bookingitem = await Bookings.findByIdAndDelete(bookingid);
    if (!bookingitem) {
      return new Response(JSON.stringify({ message: "Booking not found." }), {
        status: 404,
      });
    }

    // Find the room and remove the booking reference from its current bookings
    const room = await Rooms.findById(roomid);
    if (!room) {
      return new Response(JSON.stringify({ message: "Room not found." }), {
        status: 404,
      });
    }

    room.currentbookings = room.currentbookings.filter(
      (booking) => booking.bookingid.toString() !== bookingid
    );
    await room.save();

    return new Response(
      JSON.stringify({
        message: "Your booking has been cancelled successfully.",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error." }), {
      status: 500,
    });
  }
}
