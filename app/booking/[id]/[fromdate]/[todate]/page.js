"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import StripeCheckout from "react-stripe-checkout";
import swal from "sweetalert";
import moment from "moment";

const Booking = ({ params }) => {
  const { fromdate, todate } = params;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [room, setRoom] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (fromdate && todate) {
      const calculateTotalDays = (fromDateStr, toDateStr) => {
        const fromDate = moment(fromDateStr, "DD-MM-YYYY");
        const toDate = moment(toDateStr, "DD-MM-YYYY");
        return toDate.diff(fromDate, "days") + 1;
      };

      setTotalDays(calculateTotalDays(fromdate, todate));
    }
  }, [fromdate, todate]);

  useEffect(() => {
    // Hardcoded room data for demonstration
    const fetchRoomData = () => {
      setLoading(true);
      setTimeout(() => {
        setRoom({
          imgurls: ["https://via.placeholder.com/600x400"],
          rentperday: 1500,
          roomtype: "Deluxe",
          maxpeople: 4,
        });
        setLoading(false);
      }, 1000); // Simulating network delay
    };

    fetchRoomData();
  }, []);

  useEffect(() => {
    if (room && totalDays > 0) {
      setTotalAmount(totalDays * room.rentperday);
    }
  }, [room, totalDays]);

  async function onToken(token) {
    const bookingDetails = {
      room,
      fromdate,
      todate,
      totalAmount,
      totalDays,
      token,
    };

    try {
      setLoading(true);
      // Simulate booking process
      setTimeout(() => {
        setLoading(false);
        swal(
          "Congratulations",
          "Your Room Booked Successfully",
          "success"
        ).then(() => {
          router.push("/");
        });
      }, 1000); // Simulating network delay
    } catch (error) {
      setLoading(false);
      swal("Oops", "Something Went Wrong", "error");
    }
  }

  return (
    <div className="container mx-auto p-6">
      {loading ? (
        <h1 className="text-center text-2xl font-semibold">Loading...</h1>
      ) : error ? (
        <h1 className="text-center text-2xl font-semibold text-red-600">
          Error...
        </h1>
      ) : room ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 shadow-lg rounded-lg ">
          {/* Image Column */}
          <div className="flex flex-col">
            <img
              src={room.imgurls ? room.imgurls[0] : ""}
              className="w-full h-[70%] object-cover"
              alt=""
            />
            <div className="p-6 bg-white text-base text-gray-700 flex-1">
              <p className="font-semibold">Hotel Details</p>
              <hr className="border-t border-gray-300 my-2" />
              <div className="grid grid-cols-2 gap-4 mb-10">
                <p>Mountain View Resort</p>
                <p>123 Scenic Route</p>
                <p>Beautiful Valley, OR 97700</p>
                <p>(541) 727-7222</p>
                <p>reservations@mountainview.com</p>
                <p>www.mountainview.com</p>
              </div>
            </div>
          </div>
          {/* Content Column */}
          <div className="p-6 bg-white flex flex-col">
            <div className="flex-grow">
              <h2 className="text-xl font-semibold">
                Reservation Confirmation
              </h2>
              <p className="text-gray-700">
                Your Confirmation Number is{" "}
                <span className="font-bold text-gray-900">
                  DY{Math.floor(Math.random() * 100000)}
                </span>
              </p>
              <div className="grid grid-cols-2 gap-6 mt-4">
                <div>
                  <p className="font-semibold">Name</p>
                  <hr className="border-t border-gray-300 my-2" />
                  <p>John Doe</p> {/* Hardcoded user name for demo */}
                </div>
                <div>
                  <p className="font-semibold">Check-in</p>
                  <hr className="border-t border-gray-300 my-2" />
                  <p>{fromdate}</p>
                </div>
                <div>
                  <p className="font-semibold">Check-out</p>
                  <hr className="border-t border-gray-300 my-2" />
                  <p>{todate}</p>
                </div>
                <div>
                  <p className="font-semibold">Room Type</p>
                  <hr className="border-t border-gray-300 my-2" />
                  <p>{room.roomtype}</p>
                </div>
                <div>
                  <p className="font-semibold">Guests</p>
                  <hr className="border-t border-gray-300 my-2" />
                  <p>{room.maxpeople} people</p>
                </div>
                <div>
                  <p className="font-semibold">Total Amount</p>
                  <hr className="border-t border-gray-300 my-2" />
                  <p>{totalAmount} THB</p>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <StripeCheckout
                amount={totalAmount * 100}
                token={onToken}
                currency="THB"
                stripeKey="pk_test_51PtqEvRtSzM7gc69LKMSZFvUdCdC0DIiTGVkADKoDgSBOqL0LGTgmI16PAjMkl2M3vDixtm9rpXx6YdUyy8zNOel00JEsyhTmz"
              >
                <button className="bg-[#a08448] text-white font-bold py-3 px-5 rounded-lg hover:bg-[#8c7240] transition duration-300">
                  Pay Now
                </button>
              </StripeCheckout>
            </div>
          </div>
        </div>
      ) : (
        <h1 className="text-center text-2xl font-semibold">
          No room data available
        </h1>
      )}
    </div>
  );
};

export default Booking;
