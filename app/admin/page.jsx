"use client";
import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import axios from "axios";
import swal from "sweetalert";
import { FaEdit, FaTrash } from "react-icons/fa";
import Loading from "@/components/Loading";
import Error from "@/components/Error";

const Admin = () => {
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser || !currentUser.isAdmin) {
      window.location.href = "/";
    }
  }, []);

  return (
    <div className=" mt-20  bg-gradient-to-r from-blue-50 to-purple-50">
      <h1 className="text-center text-3xl pt-10 text-[#42275a]">
        ADMIN DASHBOARD
      </h1>
      <Tabs
        className="bg-gradient-to-r from-blue-50 to-purple-50 px-3"
        defaultActiveKey="1"
        items={[
          { label: "Bookings", key: "1", children: <Bookings /> },
          { label: "Rooms", key: "2", children: <Rooms /> },
          { label: "Add Rooms", key: "3", children: <AddRoom /> },
          { label: "Users", key: "4", children: <Users /> },
        ]}
      />
    </div>
  );
};

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("/api/booking/bookings");
        setBookings(data);
      } catch (error) {
        console.error(error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
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

  return (
    <div className="row ">
      <div className="col-md-12 ">
        <table className="min-w-full bg-gradient-to-r from-blue-50 to-purple-50 border-collapse">
          <thead>
            <tr className="bg-blue-200">
              <th className="p-3 border-b text-left">Booking ID</th>
              <th className="p-3 border-b text-left">User ID</th>
              <th className="p-3 border-b text-left">Room</th>
              <th className="p-3 border-b text-left">From</th>
              <th className="p-3 border-b text-left">To</th>
              <th className="p-3 border-b text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 &&
              bookings.map((booking, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{booking._id}</td>
                  <td className="p-3 border-b">{booking.userid}</td>
                  <td className="p-3 border-b">{booking.room}</td>
                  <td className="p-3 border-b">{booking.fromdate}</td>
                  <td className="p-3 border-b">{booking.todate}</td>
                  <td className="p-3 border-b">
                    {booking.status === "booked" ? (
                      <span className="px-2 py-1 bg-green-200 text-green-800 text-xs font-medium rounded-full">
                        Confirmed
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-red-200 text-red-800 text-xs font-medium rounded-full">
                        Cancelled
                      </span>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("/api/room/rooms");
        setRooms(data);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const deleteRoom = async (roomId) => {
    const confirmed = await swal({
      title: "Are you sure?",
      text: "This room will be deleted!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });

    if (confirmed) {
      try {
        setLoading(true);
        // Correctly formatted URL
        await axios.delete(`/api/room/delete/${roomId}`);
        swal("Deleted!", "Room has been deleted.", "success");
        setRooms(rooms.filter((room) => room._id !== roomId));
      } catch (error) {
        swal(
          "Oops",
          error.response.data.message || "Failed to delete the room!",
          "error"
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
  };

  const updateRoom = (updatedRoom) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room._id === updatedRoom._id ? updatedRoom : room
      )
    );
    setEditingRoom(null);
  };
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
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

  return (
    <div className="row">
      <div className="col-md-12">
        <table className="min-w-full bg-gradient-to-r from-blue-50 to-purple-50 border-collapse">
          <thead>
            <tr className="bg-blue-200">
              <th className="p-3 border-b text-left">Room ID</th>
              <th className="p-3 border-b text-left">Name</th>
              <th className="p-3 border-b text-left">Type</th>
              <th className="p-3 border-b text-left">Rent Per Day</th>
              <th className="p-3 border-b text-left">Max People</th>
              <th className="p-3 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.length > 0
              ? rooms.map((room) => (
                  <tr key={room._id} className="hover:bg-gray-50">
                    <td className="p-3 border-b">{room._id}</td>
                    <td className="p-3 border-b">{room.name}</td>
                    <td className="p-3 border-b">{room.roomtype}</td>
                    <td className="p-3 border-b">{room.rentperday}</td>
                    <td className="p-3 border-b">{room.maxpeople}</td>
                    <td className="p-3 border-b">
                      <button
                        className="text-blue-500 hover:text-blue-700 mr-2"
                        onClick={() => handleEdit(room)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => deleteRoom(room._id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              : !loading && (
                  <tr>
                    <td colSpan="6" className="p-3 border-b text-center">
                      No rooms found.
                    </td>
                  </tr>
                )}
          </tbody>
        </table>
        {editingRoom && (
          <AddRoom
            room={editingRoom}
            setEditingRoom={setEditingRoom}
            updateRoom={updateRoom}
          />
        )}
      </div>
    </div>
  );
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("/api/user/users");
        setUsers(data);
      } catch (error) {
        console.error(error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
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

  return (
    <div className="row">
      <div className="col-md-12">
        <table className="min-w-full bg-gradient-to-r from-blue-50 to-purple-50 border-collapse">
          <thead>
            <tr className="bg-blue-200">
              <th className="p-3 border-b text-left">User ID</th>
              <th className="p-3 border-b text-left">Name</th>
              <th className="p-3 border-b text-left">Email</th>
              <th className="p-3 border-b text-left">Admin</th>
            </tr>
          </thead>
          <tbody>
            {users &&
              users.map((user, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{user._id}</td>
                  <td className="p-3 border-b">{user.name}</td>
                  <td className="p-3 border-b">{user.email}</td>
                  <td className="p-3 border-b">
                    {user.isAdmin ? (
                      <span className="px-2 py-1 bg-green-200 text-green-800 text-xs font-medium rounded-full">
                        YES
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-red-200 text-red-800 text-xs font-medium rounded-full">
                        NO
                      </span>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AddRoom = ({ room, setEditingRoom, updateRoom }) => {
  const [formData, setFormData] = useState({
    name: room ? room.name : "",
    roomtype: room ? room.roomtype : "",
    rentperday: room ? room.rentperday : "",
    maxpeople: room ? room.maxpeople : "",
    description: room ? room.description : "",
    phonenumber: room ? room.phonenumber : "",
    imgurls: room && room.imgurls ? room.imgurls : ["", "", ""],
  });

  useEffect(() => {
    if (room) {
      setFormData({
        name: room.name,
        roomtype: room.roomtype,
        rentperday: room.rentperday,
        maxpeople: room.maxpeople,
        description: room.description,
        phonenumber: room.phonenumber,
        imgurls: room.imgurls || ["", "", ""],
      });
    }
  }, [room]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("imgurl")) {
      const index = parseInt(name.split("_")[1], 10);
      const newImgurls = [...formData.imgurls];
      newImgurls[index] = value;
      setFormData({ ...formData, imgurls: newImgurls });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const roomId = room ? room._id : null;
      const dataToSend = { ...formData, roomId };

      if (room) {
        await axios.put(`/api/room/update`, dataToSend);
        swal("Success", "Room updated successfully!", "success");
        setEditingRoom(null);
      } else {
        await axios.post("/api/room/create", formData);
        swal("Success", "Room added successfully!", "success");
        window.location.href = "/";
      }

      setFormData({
        name: "",
        roomtype: "",
        rentperday: "",
        maxpeople: "",
        description: "",
        phonenumber: "",
        imgurls: ["", "", ""],
      });
    } catch (error) {
      console.error("Error updating room:", error);
      swal("Error", "Failed to save room!", "error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="bg-white bg-opacity-80 rounded-lg p-8 shadow-lg w-11/12 md:w-4/5 lg:w-3/5">
        <h2 className="text-3xl font-semibold text-center text-[#42275a] mb-4">
          {room ? "Edit Room" : "Add Room"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label className="block mb-2 text-[#42275a]" htmlFor="name">
              Room Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#734b6d] text-gray-800"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-[#42275a]" htmlFor="roomtype">
              Room Type
            </label>
            <input
              type="text"
              name="roomtype"
              value={formData.roomtype}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#734b6d] text-gray-800"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-[#42275a]" htmlFor="rentperday">
              Rent Per Day
            </label>
            <input
              type="number"
              name="rentperday"
              value={formData.rentperday}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#734b6d] text-gray-800"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-[#42275a]" htmlFor="maxpeople">
              Max People
            </label>
            <input
              type="text"
              name="maxpeople"
              value={formData.maxpeople || ""}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#734b6d] text-gray-800"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-[#42275a]" htmlFor="phonenumber">
              Phone Number
            </label>
            <input
              type="text"
              name="phonenumber"
              value={formData.phonenumber}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#734b6d] text-gray-800"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-[#42275a]" htmlFor="description">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#734b6d] text-gray-800"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-[#42275a]">Image URLs</label>
            {formData.imgurls.map((imgurl, index) => (
              <input
                key={index}
                type="text"
                name={`imgurl_${index}`}
                value={imgurl}
                onChange={handleChange}
                placeholder={`Image URL ${index + 1}`}
                className="border border-gray-300 rounded p-3 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-[#734b6d] text-gray-800"
              />
            ))}
          </div>
          <button
            type="submit"
            className="bg-[#734b6d] text-white rounded p-3 w-full hover:bg-[#42275a] transition duration-300"
          >
            {room ? "Update Room" : "Add Room"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Admin;
