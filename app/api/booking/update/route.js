import { Users } from "@/app/models/user";
import { Bookings } from "@/app/models/booking";
import { Rooms } from "@/app/models/room";
import { NextResponse } from "next/server";

export async function PUT(request) {
  const body = await request.json();
  console.log("Received data:", body);

  const {
    userid,
    bookingId,
    roomid,
    fromdate,
    todate,
    totalAmount,
    totalDays,
  } = body;

  if (!userid || !bookingId || !roomid || !fromdate || !todate) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    // Validate user
    const user = await Users.findById(userid);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    if (user.isAdmin) {
      return NextResponse.json(
        { message: "Permission denied: Admins cannot update bookings" },
        { status: 403 }
      );
    }

    // Validate booking ID
    const booking = await Bookings.findById(bookingId);
    if (!booking) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 404 }
      );
    }

    // Check room availability
    const room = await Rooms.findById(roomid);
    if (!room) {
      return NextResponse.json({ message: "Room not found" }, { status: 404 });
    }

    // Validate dates
    const fromDate = new Date(fromdate);
    const toDate = new Date(todate);

    if (isNaN(fromDate) || isNaN(toDate)) {
      return NextResponse.json(
        { message: "Invalid date format." },
        { status: 400 }
      );
    }

    const newTotalDays = (toDate - fromDate) / (1000 * 60 * 60 * 24);
    if (newTotalDays < 0) {
      return NextResponse.json(
        {
          message:
            "Check your dates. The 'From' date must be before the 'To' date.",
        },
        { status: 400 }
      );
    }

    // Check for overlapping bookings
    const overlappingBooking = room.currentbookings.find(
      (b) =>
        b.bookingid !== bookingId &&
        ((new Date(b.fromdate) <= toDate && new Date(b.fromdate) >= fromDate) ||
          (new Date(b.todate) >= fromDate && new Date(b.todate) <= toDate))
    );

    if (overlappingBooking) {
      return NextResponse.json(
        { message: "Room is not available for the selected dates" },
        { status: 400 }
      );
    }

    // Update booking details
    booking.roomid = roomid;
    booking.fromdate = fromdate;
    booking.todate = todate;
    booking.totalAmount = totalAmount;
    booking.totalDays = newTotalDays;

    await booking.save();

    // Update room's current bookings
    room.currentbookings = room.currentbookings.map((b) =>
      b.bookingid === bookingId
        ? { bookingid: bookingId, fromdate, todate, userid, status: "booked" }
        : b
    );
    await room.save();

    return NextResponse.json(
      { message: "Booking updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Booking update error:", error);
    return NextResponse.json(
      { message: "Booking update failed", error: error.message },
      { status: 400 }
    );
  }
}
