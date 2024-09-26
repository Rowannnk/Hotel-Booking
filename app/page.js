"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Room from "../components/Room";
import { DatePicker } from "antd";
import moment from "moment";
import Loading from "@/components/Loading";
import Error from "@/components/Error";

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
      setLoading(true);
      try {
        // Simulate loading for 1 second
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const response = await axios.get("/api/room/rooms");
        setRooms(response.data);
        setFilteredRooms(response.data);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filterRooms = () => {
    let tempRooms = [...rooms];

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

    if (search) {
      tempRooms = tempRooms.filter((room) =>
        room.name.toLowerCase().includes(search.toLowerCase())
      );
    }

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
    <div className="p-5 mt-20 bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="relative bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg overflow-hidden shadow-2xl">
        <div
          className="bg-cover bg-center h-[300px] sm:h-[400px] md:h-[500px] relative"
          style={{
            backgroundImage: `url('https://wallpapercave.com/wp/wp3642631.jpg')`,
          }}
        >
          <div className="absolute inset-0 bg-black opacity-30"></div>
          <div className="relative z-10 flex flex-col items-center justify-center text-center py-10 md:py-20 space-y-6">
            <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
              Discover Your Perfect Room
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
              <RangePicker
                className="w-full md:w-auto px-4 py-3 rounded-lg text-gray-800 bg-white shadow-lg hover:shadow-2xl transition-all duration-300"
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

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                className="w-full md:w-auto px-4 py-3 rounded-lg text-gray-800 bg-white shadow-lg hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-400"
                placeholder="Search Rooms"
              />

              <select
                className="w-full md:w-auto px-4 py-3 rounded-lg bg-white text-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-400"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="all">All</option>
                <option value="deluxe">Deluxe</option>
                <option value="suite">Suite</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {loading && !error && (
        <div className="mt-10">
          <Loading />
        </div>
      )}
      {error && !loading && <Error />}
      <div className="mt-10">
        {filteredRooms && filteredRooms.length === 0 && !loading && !error && (
          <h1 className="text-center text-2xl font-semibold text-gray-600">
            No rooms found matching your criteria
          </h1>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {filteredRooms.map((room, index) => (
            <Room key={index} room={room} fromdate={fromdate} todate={todate} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
