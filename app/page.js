"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Room from "../components/Room";
import { DatePicker } from "antd";
import moment from "moment";

const { RangePicker } = DatePicker;

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [fromdate, setFromdate] = useState("");
  const [todate, setTodate] = useState("");
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/room/rooms"); // Next.js API route
        setRooms(response.data);
        setFilteredRooms(response.data);
        setLoading(false);
      } catch (error) {
        setError(true);
        console.error(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filterRooms = () => {
    let tempRooms = [...rooms];

    // Filter by date
    if (fromdate && todate) {
      tempRooms = tempRooms.filter((room) => {
        if (room.currentbookings.length === 0) return true;

        return room.currentbookings.every((booking) => {
          const bookingFromDate = moment(booking.fromdate, "DD-MM-YYYY");
          const bookingToDate = moment(booking.todate, "DD-MM-YYYY");
          const requestedFromDate = moment(fromdate, "DD-MM-YYYY");
          const requestedToDate = moment(todate, "DD-MM-YYYY");

          return (
            requestedToDate.isBefore(bookingFromDate) ||
            requestedFromDate.isAfter(bookingToDate)
          );
        });
      });
    }

    // Filter by search term
    if (search) {
      tempRooms = tempRooms.filter((room) =>
        room.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by type
    if (type && type !== "all") {
      tempRooms = tempRooms.filter(
        (room) =>
          room.roomtype && room.roomtype.toLowerCase() === type.toLowerCase()
      );
    }

    setFilteredRooms(tempRooms);
  };

  useEffect(() => {
    filterRooms();
  }, [search, type, fromdate, todate]);

  return (
    <div className="container mx-auto p-5">
      <div
        className="bg-cover bg-center h-1/2-screen relative"
        style={{
          backgroundImage: `url('https://cdn.prod.website-files.com/5c6d6c45eaa55f57c6367749/65046bf150d1abb7e5911702_x-65046bcfdc4f0.webp')`,
          height: "50vh",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-white text-center py-20">
          <h1 className="text-5xl font-bold mb-8">Find Your Perfect Room</h1>
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="w-full md:w-auto">
              <RangePicker
                className="w-full h-10"
                format="DD-MM-YYYY"
                onChange={(dates) => {
                  if (dates && dates.length === 2) {
                    setFromdate(dates[0].format("DD-MM-YYYY"));
                    setTodate(dates[1].format("DD-MM-YYYY"));
                  } else {
                    setFromdate("");
                    setTodate("");
                  }
                }}
              />
            </div>
            <div className="w-full md:w-auto">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                className="w-full h-10 px-4 rounded-lg text-gray-800"
                placeholder="Search Rooms"
              />
            </div>
            <div className="w-full md:w-auto">
              <select
                className="w-full h-10 px-4 rounded-lg text-gray-800"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="all">All</option>
                <option value="delux">Delux</option>
                <option value="suite">Suite</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10">
        {loading && <h1 className="text-center text-xl">Loading...</h1>}
        {error && (
          <h1 className="text-center text-xl text-red-600">
            Error loading rooms
          </h1>
        )}
        {filteredRooms && filteredRooms.length === 0 && (
          <h1 className="text-center text-xl">
            No rooms found matching your criteria
          </h1>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {filteredRooms &&
            filteredRooms.map((room, index) => (
              <Room
                key={index}
                room={room}
                fromdate={fromdate}
                todate={todate}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
