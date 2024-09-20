"use client";
import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Tag } from "antd";
import swal from "sweetalert";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Simulate fetching user and bookings data
  useEffect(() => {
    setLoading(true);
    const fetchedUser = {
      _id: "1",
      name: "John Doe",
      email: "johndoe@example.com",
      isAdmin: false,
    };

    const fetchedBookings = [
      {
        _id: "123",
        room: "Room 101",
        fromdate: "2024-09-21",
        todate: "2024-09-25",
        totalAmount: 400,
        status: "booked",
        roomid: "r1",
      },
    ];

    setTimeout(() => {
      setUser(fetchedUser);
      setBookings(fetchedBookings);
      setEditForm({
        name: fetchedUser.name,
        email: fetchedUser.email,
        password: "",
      });
      setLoading(false);
    }, 1000);
  }, []);

  //   const cancelBooking = (bookingid, roomid) => {
  //     swal("Cancelled!", "Your booking has been cancelled.", "success");
  //     setBookings((prevBookings) =>
  //       prevBookings.filter((booking) => booking._id !== bookingid)
  //     );
  //   };

  const deleteUser = () => {
    swal("Deleted!", "Your account has been deleted.", "success").then(() => {
      window.location.href = "/login";
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setUser((prevUser) => ({ ...prevUser, ...editForm }));
    setIsEditing(false);
    swal("Updated!", "Your profile has been updated.", "success");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-4xl space-y-8">
        <div className="bg-white rounded-lg shadow-md p-8 space-y-6 text-center">
          <h1 className="text-3xl font-bold tracking-wide">My Profile</h1>

          {isEditing ? (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label className="text-lg font-medium">Name:</label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  className="p-2 border rounded"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-lg font-medium">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  className="p-2 border rounded"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-lg font-medium">Password:</label>
                <input
                  type="password"
                  name="password"
                  value={editForm.password}
                  onChange={handleEditChange}
                  className="p-2 border rounded"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </form>
          ) : (
            <>
              {user && (
                <div className="flex flex-col items-center space-y-4">
                  <img
                    src="https://via.placeholder.com/150"
                    alt="User"
                    className="w-20 h-20 rounded-full"
                  />
                  <h1 className="text-3xl font-bold tracking-wide">
                    {user.name}
                  </h1>
                </div>
              )}

              <div className="flex justify-center space-x-4">
                <FaEdit
                  className="text-blue-500 cursor-pointer hover:text-blue-600"
                  size={24}
                  title="Edit"
                  onClick={() => setIsEditing(true)}
                />
                <FaTrash
                  className="text-red-500 cursor-pointer hover:text-red-600"
                  size={24}
                  title="Delete"
                  onClick={deleteUser}
                />
              </div>

              {user && (
                <div className="grid grid-cols-1 gap-4">
                  <button className="w-full text-center bg-gray-100 p-4 rounded-lg flex justify-center items-center space-x-4 hover:bg-gray-200">
                    <span role="img" aria-label="address" className="text-xl">
                      👤
                    </span>
                    <span className="text-lg font-medium">
                      Email: {user.email}
                    </span>
                  </button>
                  <button className="w-full text-center bg-gray-100 p-4 rounded-lg flex justify-center items-center space-x-4 hover:bg-gray-200">
                    <span
                      role="img"
                      aria-label="notifications"
                      className="text-xl"
                    >
                      🌐
                    </span>
                    <span className="text-lg font-medium">
                      isAdmin: {user.isAdmin ? "YES" : "NO"}
                    </span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 space-y-4">
          <h1 className="text-3xl font-bold tracking-wide text-center">
            My Bookings
          </h1>
          {bookings.length === 0 && <p>No bookings found.</p>}
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="p-6 border border-gray-200 rounded-lg shadow-sm bg-gray-50 space-y-4"
            >
              <h2 className="text-xl font-bold tracking-tight">
                {booking.room}
              </h2>
              <p className="text-sm">
                <strong className="text-[#a08448] mr-2">Booking ID:</strong>{" "}
                {booking._id}
              </p>
              <p className="text-sm">
                <strong className="text-[#a08448] mr-2">Check In:</strong>{" "}
                {booking.fromdate}
              </p>
              <p className="text-sm">
                <strong className="text-[#a08448] mr-2">Check Out:</strong>{" "}
                {booking.todate}
              </p>
              <p className="text-sm">
                <strong className="text-[#a08448] mr-2">Amount:</strong>{" "}
                {booking.totalAmount}
              </p>
              <p className="text-sm">
                <strong className="text-[#a08448] mr-2">Status:</strong>
                {booking.status === "booked" ? (
                  <Tag color="green">Confirmed</Tag>
                ) : (
                  <Tag color="red">Cancelled</Tag>
                )}
              </p>
              <div className="flex justify-end items-center space-x-4">
                <FaEdit
                  className="text-blue-500 cursor-pointer hover:text-blue-600"
                  size={20}
                  title="Edit"
                />
                {booking.status.trim().toLowerCase() !== "cancel" && (
                  <button className="px-4 py-2 bg-[#a08448] text-white rounded-md hover:bg-[#8c7240]">
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
