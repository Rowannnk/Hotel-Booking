import { Users } from "@/app/models/user"; // Adjust based on your structure
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"; // Make sure to install and import bcrypt if you need password hashing

export async function PUT(request) {
  try {
    const { userid, name, email, password } = await request.json();

    // Check if userid is provided
    if (!userid) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const updateData = { name, email };

    // Hash the password if it is provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await Users.findByIdAndUpdate(userid, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { message: "Error updating user profile", error: error.message },
      { status: 500 }
    );
  }
}
