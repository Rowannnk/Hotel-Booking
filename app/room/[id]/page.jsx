"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaUsers, FaMoneyBillWave, FaBed, FaPhone } from "react-icons/fa";
import { MdArrowBack } from "react-icons/md";
import Loading from "@/components/Loading";
import Error from "@/components/Error";

const RoomDetails = ({ params }) => {
  const { id } = params;
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/room/rooms/${id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const roomData = await response.json();
        setRoom(roomData);
        setMainImage(roomData.imgurls[0]);
      } catch (err) {
        console.error("Error fetching room details:", err);
        setError("Failed to load room details.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [id]);

  const handleThumbnailClick = (url) => {
    setMainImage(url);
  };

  const handleGoBack = () => {
    router.push("/");
  };

  if (loading) {
    return (
      <div className="mt-20 flex items-center justify-center h-screen">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-20 flex items-center justify-center h-screen">
        <Error />
      </div>
    );
  }
  if (!room) {
    return (
      <div className="mt-20 flex items-center justify-center h-screen">
        No room details found.
      </div>
    );
  }

  return (
    <div className="mx-auto p-6 mt-20 bg-gradient-to-r from-blue-50 to-purple-50">
      {/* Image Section */}
      <div className="flex flex-col items-center">
        <img
          src={mainImage}
          alt={room.name}
          className="w-full max-w-4xl h-[500px] object-cover rounded-lg shadow-lg mb-6"
        />
        <div className="flex gap-2 mt-4">
          {room.imgurls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Thumbnail ${index}`}
              className={`w-[100px] h-[100px] object-cover cursor-pointer rounded-lg transition-transform hover:scale-105 ${
                url === mainImage ? "border-4 border-indigo-500" : "border"
              }`}
              onClick={() => handleThumbnailClick(url)}
            />
          ))}
        </div>
      </div>

      {/* Room Information Section */}
      <div className="mt-8 max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-4xl font-bold text-indigo-600 mb-4 text-center">
          {room.name}
        </h2>
        <div className="space-y-4 mt-4">
          <div className="flex items-center">
            <FaUsers className="text-indigo-500 mr-3" />
            <span className="text-lg font-medium">
              Max People: {room.maxpeople}
            </span>
          </div>
          <div className="flex items-center">
            <FaMoneyBillWave className="text-green-500 mr-3" />
            <span className="text-lg font-medium">
              Price: {room.rentperday} THB
            </span>
          </div>
          <div className="flex items-center">
            <FaBed className="text-purple-500 mr-3" />
            <span className="text-lg font-medium">
              Room Type: {room.roomtype}
            </span>
          </div>
          <div className="flex items-center">
            <FaPhone className="text-yellow-500 mr-3" />
            <span className="text-lg font-medium">
              Phone Number: {room.phonenumber}
            </span>
          </div>
        </div>

        {/* Description Section */}
        <div className="mt-6">
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">
            Description
          </h3>
          <p className="text-gray-600 bg-gray-100 p-4 rounded-lg shadow-inner">
            {room.description}
          </p>
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={handleGoBack}
          className="flex items-center px-6 py-3 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition"
        >
          <MdArrowBack className="mr-2" /> Back to Home
        </button>
      </div>
    </div>
  );
};

export default RoomDetails;
