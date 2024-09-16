"use client";

import React, { useState, useEffect } from "react";

const RoomDetails = () => {
  const roomid = "123"; // Static room id for demonstration
  const [room, setRoom] = useState(null);
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    // Simulated room data
    const simulatedRoomData = {
      id: roomid,
      name: "Deluxe Room",
      imgurls: [
        "https://t3.ftcdn.net/jpg/02/71/08/28/360_F_271082810_CtbTjpnOU3vx43ngAKqpCPUBx25udBrg.jpg",
        "https://t3.ftcdn.net/jpg/02/71/08/28/360_F_271082810_CtbTjpnOU3vx43ngAKqpCPUBx25udBrg.jpg",
        "https://t3.ftcdn.net/jpg/02/71/08/28/360_F_271082810_CtbTjpnOU3vx43ngAKqpCPUBx25udBrg.jpg",
      ],
      maxpeople: 3,
      rentperday: 1500,
      roomtype: "Suite",
      phonenumber: "123-456-7890",
      description: "A spacious and luxurious room with all modern amenities.",
    };

    setRoom(simulatedRoomData);
    setMainImage(simulatedRoomData.imgurls[0]);
  }, [roomid]);

  const handleThumbnailClick = (url) => {
    setMainImage(url);
  };

  if (!room) return <div>No room details found.</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex">
        {/* Thumbnails */}
        <div className="w-1/4 mr-4 flex flex-col gap-4 h-[650px]">
          {room.imgurls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Thumbnail ${index}`}
              className={`w-full h-[140px] object-cover cursor-pointer rounded transition-transform transform hover:scale-105 ${
                url === mainImage ? "border-2 border-blue-500" : ""
              }`}
              onClick={() => handleThumbnailClick(url)}
            />
          ))}
        </div>
        {/* Large Main Image */}
        <div className="flex-1">
          <img
            src={mainImage}
            alt={room.name}
            className="w-full h-[450px] object-cover"
          />
        </div>
      </div>
      <div className="-mt-40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Column 1: Room Details */}
          <div>
            <h2 className="text-2xl font-extrabold mb-4 text-gray-800">
              {room.name}
            </h2>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-[#a08448] font-semibold w-32">
                  Max People:
                </span>
                <span className="text-gray-700">{room.maxpeople}</span>
              </div>
              <hr className="border-t border-gray-300 mb-2" />
              <div className="flex items-center">
                <span className="text-[#a08448] font-semibold w-32">
                  Price:
                </span>
                <span className="text-gray-700">{room.rentperday} THB</span>
              </div>
              <hr className="border-t border-gray-300 mb-2" />
              <div className="flex items-center">
                <span className="text-[#a08448] font-semibold w-32">
                  Room Type:
                </span>
                <span className="text-gray-700">{room.roomtype}</span>
              </div>
              <hr className="border-t border-gray-300 mb-2" />
              <div className="flex items-center">
                <span className="text-[#a08448] font-semibold w-32">
                  Phone Number:
                </span>
                <span className="text-gray-700">{room.phonenumber}</span>
              </div>
              <hr className="border-t border-gray-300 mb-2" />
            </div>
          </div>
          {/* Column 2: Description */}
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
              Description
            </h3>
            <p className="text-gray-700">{room.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
