import mongoose from "mongoose";

const roomSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    maxpeople: {
      type: Number,
      required: true,
    },
    phonenumber: {
      type: String, // Change to String for flexibility
      required: true,
    },
    rentperday: {
      type: Number,
      required: true,
    },
    imgurls: {
      type: [String], // Define as an array of strings
      required: true,
    },
    currentbookings: [Object],

    roomtype: {
      type: String,
      required: true,
      default: "Suite",
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Rooms = mongoose.models.Room || mongoose.model("Room", roomSchema);
