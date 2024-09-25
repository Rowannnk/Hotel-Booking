// pages/api/bookroom.js
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import Stripe from "stripe";
import dbConnect from "@/libs/mongodb";
import { Bookings } from "@/app/models/booking";
import { Rooms } from "@/app/models/room";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  const { room, userid, fromdate, todate, totalAmount, totalDays, token } =
    await request.json();

  try {
    await dbConnect();

    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    const payment = await stripe.charges.create(
      {
        amount: totalAmount * 100,
        customer: customer.id,
        currency: "THB",
        receipt_email: token.email,
      },
      {
        idempotencyKey: uuidv4(),
      }
    );

    if (payment) {
      if (
        !room ||
        !room._id ||
        !userid ||
        !fromdate ||
        !todate ||
        !totalAmount ||
        !totalDays
      ) {
        return NextResponse.json(
          { message: "Missing required fields" },
          { status: 400 }
        );
      }

      // Create a new booking
      const newBooking = new Bookings({
        room: room.name,
        roomid: room._id,
        userid,
        fromdate,
        todate,
        totalAmount,
        totalDays,
        transitionId: payment.id, // Use the payment ID as the transition ID
      });

      const booking = await newBooking.save();

      // Update current bookings for the room
      const roomTemp = await Rooms.findOne({ _id: room._id });
      roomTemp.currentbookings.push({
        bookingid: booking._id,
        fromdate,
        todate,
        userid,
        status: booking.status,
      });

      await roomTemp.save();

      return NextResponse.json(
        { message: "Room Booked Successfully", booking },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { message: "Booking failed", error: error.message },
      { status: 500 }
    );
  }
}
