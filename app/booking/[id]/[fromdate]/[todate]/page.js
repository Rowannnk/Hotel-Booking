"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import StripeCheckout from "react-stripe-checkout";
import swal from "sweetalert";
import Loading from "@/components/Loading";
import Error from "@/components/Error";

const Booking = ({ params }) => {
  const { id: roomid, fromdate, todate } = params;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [room, setRoom] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalDays, setTotalDays] = useState(0);

  useEffect(() => {
    const fetchRoomData = async () => {
      const currentUser = localStorage.getItem("currentUser");

      if (!currentUser) {
        window.location.href = "/login";
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`/api/room/rooms/${roomid}`);
        setRoom(response.data);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (roomid) {
      fetchRoomData();
    }
  }, [roomid]);

  useEffect(() => {
    if (fromdate && todate) {
      const fromDate = moment(fromdate, "DD-MM-YYYY");
      const toDate = moment(todate, "DD-MM-YYYY");
      setTotalDays(toDate.diff(fromDate, "days"));
    }
  }, [fromdate, todate]);

  useEffect(() => {
    if (room && totalDays > 0) {
      const rentPerDay = parseFloat(room.rentperday);
      setTotalAmount(totalDays * rentPerDay);
    }
  }, [room, totalDays]);

  const handleToken = async (token) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const bookingDetails = {
      room,
      userid: currentUser._id,
      fromdate,
      todate,
      totalAmount,
      totalDays,
      token,
    };

    try {
      setLoading(true);
      await axios.post("/api/booking/create", bookingDetails);
      swal("Congratulations", "Your Room Booked Successfully", "success").then(
        () => {
          window.location.href = "/";
        }
      );
    } catch (error) {
      setLoading(false);
      swal("Oops", "Something Went Wrong", "error");
    }
  };

  return (
    <div className="mx-auto p-6 mt-16 bg-gradient-to-r from-blue-50 to-purple-50 h-screen flex flex-col justify-center">
      {loading ? (
        <Loading />
      ) : error ? (
        <Error />
      ) : room ? (
        <div className="grid grid-cols-1 md:grid-cols-2 h-80vh rounded-lg shadow-lg overflow-hidden">
          {/* Image Column */}
          <div className="flex flex-col">
            <img
              src={room.imgurls ? room.imgurls[0] : ""}
              className="w-full h-full object-cover"
              alt="Room"
            />
            <div className="p-6 bg-white text-gray-700">
              <h3 className="font-semibold text-lg">Hotel Details</h3>
              <hr className="border-t border-gray-300 my-2" />
              <div className="grid grid-cols-2 gap-4">
                <p>Hotel Deluna</p>
                <p>Deluna Route</p>
                <p>Beautiful Avenue Valley, 123456789</p>
                <p>(969) 786-786</p>
                <p>reservations@deluna.com</p>
                <p>www.deluna.com</p>
              </div>
            </div>
          </div>
          {/* Content Column */}
          <div className="flex flex-col p-6 bg-white">
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
                  <p>{JSON.parse(localStorage.getItem("currentUser")).name}</p>
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
                  <p>{totalAmount.toFixed(2)} THB</p>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <StripeCheckout
                amount={totalAmount * 100}
                token={handleToken}
                currency="THB"
                stripeKey="pk_test_51PtqEvRtSzM7gc69LKMSZFvUdCdC0DIiTGVkADKoDgSBOqL0LGTgmI16PAjMkl2M3vDixtm9rpXx6YdUyy8zNOel00JEsyhTmz"
              >
                <button className="bg-[#734b6d] hover:scale-105 transition-all text-white font-bold py-2 px-6 rounded-full shadow-md">
                  Pay Now
                </button>
              </StripeCheckout>
            </div>
          </div>
        </div>
      ) : (
        <h1 className="text-center text-2xl font-semibold">Room not found.</h1>
      )}
    </div>
  );
};

export default Booking;
