"use client";
import React, { useEffect, useState } from "react";
import { Tabs, Tag } from "antd";
import axios from "axios";
import swal from "sweetalert";
import { FaEdit, FaTrash } from "react-icons/fa";

const Admin = () => {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Check if user is admin
  //   useEffect(() => {
  //     if (typeof window !== "undefined") {
  //       const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  //       if (!currentUser || !currentUser.isAdmin) {
  //         window.location.href = "/"; // Redirect to home if not admin
  //       }
  //     }
  //   }, []);

  // Fetch data for bookings, rooms, and users
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [bookingsRes, roomsRes, usersRes] = await Promise.all([
          axios.get("/api/booking/bookings"),
          axios.get("/api/room/rooms"),
          axios.get("/api/user/users"),
        ]);
        setBookings(bookingsRes.data);
        setRooms(roomsRes.data);
        setUsers(usersRes.data);
      } catch (error) {
        console.error(error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const deleteRoom = async (roomId) => {
    try {
      await axios.delete(`/api/room/delete/${roomId}`);
      swal("Success", "Room deleted successfully", "success");
      setRooms(rooms.filter((room) => room._id !== roomId));
    } catch (error) {
      console.error(error);
      swal("Error", "Failed to delete room", "error");
    }
  };

  return (
    <div className="ml-3 mt-3 mr-3">
      <h1 className="text-center text-3xl">Admin Panel</h1>
      <Tabs defaultActiveKey="1">
        {/* Bookings Tab */}
        <Tabs.TabPane tab="Bookings" key="1">
          <div className="row">
            <div className="col-md-12">
              {loading && <p>Loading...</p>}
              {error && <p>There was an error loading bookings.</p>}
              <table className="min-w-full bg-white border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 border-b text-left">Booking ID</th>
                    <th className="p-3 border-b text-left">User ID</th>
                    <th className="p-3 border-b text-left">Room</th>
                    <th className="p-3 border-b text-left">From</th>
                    <th className="p-3 border-b text-left">To</th>
                    <th className="p-3 border-b text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-3 border-b">{booking._id}</td>
                      <td className="p-3 border-b">{booking.userid}</td>
                      <td className="p-3 border-b">{booking.room}</td>
                      <td className="p-3 border-b">{booking.fromdate}</td>
                      <td className="p-3 border-b">{booking.todate}</td>
                      <td className="p-3 border-b">
                        {booking.status === "booked" ? (
                          <Tag color="green">Confirmed</Tag>
                        ) : (
                          <Tag color="red">Cancelled</Tag>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Tabs.TabPane>

        {/* Rooms Tab */}
        <Tabs.TabPane tab="Rooms" key="2">
          <div className="row">
            <div className="col-md-12">
              {loading && <p>Loading...</p>}
              {error && <p>There was an error loading rooms.</p>}
              <table className="min-w-full bg-white border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 border-b text-left">Room ID</th>
                    <th className="p-3 border-b text-left">Name</th>
                    <th className="p-3 border-b text-left">Type</th>
                    <th className="p-3 border-b text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room) => (
                    <tr key={room._id} className="hover:bg-gray-50">
                      <td className="p-3 border-b">{room._id}</td>
                      <td className="p-3 border-b">{room.name}</td>
                      <td className="p-3 border-b">{room.type}</td>
                      <td className="p-3 border-b">
                        <FaTrash
                          className="text-red-500 cursor-pointer"
                          onClick={() => deleteRoom(room._id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Tabs.TabPane>

        {/* Add Rooms Tab */}
        <Tabs.TabPane tab="Add Rooms" key="3">
          <div>
            <h2>Add a New Room</h2>
            {/* Add room form could go here */}
          </div>
        </Tabs.TabPane>

        {/* Users Tab */}
        <Tabs.TabPane tab="Users" key="4">
          <div className="row">
            <div className="col-md-12">
              {loading && <p>Loading...</p>}
              {error && <p>There was an error loading users.</p>}
              <table className="min-w-full bg-white border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 border-b text-left">User ID</th>
                    <th className="p-3 border-b text-left">Name</th>
                    <th className="p-3 border-b text-left">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="p-3 border-b">{user._id}</td>
                      <td className="p-3 border-b">{user.name}</td>
                      <td className="p-3 border-b">{user.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default Admin;
