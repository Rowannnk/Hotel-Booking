import { Users } from "@/app/models/user";
import { Bookings } from "@/app/models/booking";
import { NextResponse } from "next/server";
// import Stripe from "stripe";
// import { v4 as uuidv4 } from "uuid";

// const stripe = new Stripe(
//   "sk_test_51PtqEvRtSzM7gc69q8IvVrCyzAOTJcWq8Rnw2aJn7X0DbrboC48gAG6f4d4ixIXyTryGoKUsqyovC1ncsouxxmiD00RfjVkfJQ"
// );

export async function POST(request) {
  const body = await request.json();
  const {
    userid,
    room,
    roomid,
    fromdate,
    todate,
    totalAmount,
    totalDays,
    transitionId,
  } = body;

  try {
    // Check if the user exists and is not an admin
    const user = await Users.findById(userid);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    if (user.isAdmin) {
      return NextResponse.json(
        { message: "Permission denied: Admins cannot create bookings" },
        { status: 403 }
      );
    }

    // Create a new booking
    const newBooking = new Bookings({
      room,
      roomid,
      userid,
      fromdate,
      todate,
      totalAmount,
      totalDays,
      transitionId,
    });

    await newBooking.save();
    return NextResponse.json(
      { message: "Booking created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Booking creation error:", error);
    return NextResponse.json(
      { message: "Booking creation failed", error: error.message },
      { status: 400 }
    );
  }
}
