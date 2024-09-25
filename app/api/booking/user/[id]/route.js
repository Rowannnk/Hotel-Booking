import { Bookings } from "@/app/models/booking"; // Adjust the import based on your project structure
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { id } = params; // Get user ID from URL

  try {
    const bookings = await Bookings.find({ userid: id }); // Adjust based on your database schema
    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { message: "Error fetching bookings", error: error.message },
      { status: 500 }
    );
  }
}
