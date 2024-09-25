import { Users } from "@/app/models/user";
import dbConnect from "@/libs/mongodb";

export async function DELETE(req) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return new Response(JSON.stringify({ message: "User ID is required." }), {
        status: 400,
      });
    }

    await dbConnect();

    // Find and delete the user by their ID
    const deleteUser = await Users.findByIdAndDelete(userId);

    if (!deleteUser) {
      return new Response(JSON.stringify({ message: "User not found." }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({ message: "User successfully deleted." }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error." }), {
      status: 500,
    });
  }
}
