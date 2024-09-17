import connect from "@/libs/mongodb";

export async function register() {
  console.log("Connecting to database...");
  await connect();
}