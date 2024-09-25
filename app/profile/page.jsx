"use client";
import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import swal from "sweetalert";
import axios from "axios";
import Loading from "@/components/Loading";
import Error from "@/components/Error";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const [totalAmount, setTotalAmount] = useState();
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [editingBookingId, setEditingBookingId] = useState(null);
  const [editBookingForm, setEditBookingForm] = useState({
    room: "",
    roomid: "",
    fromdate: "",
    todate: "",
  });

  const onToken = async (token) => {
    try {
      // Send the token to  backend for processing the payment
      const response = await axios.post("/api/payment", {
        token,
        amount: totalAmount * 100,
      });
      swal("Success!", response.data.message, "success");
      // Handle successful payment
    } catch (error) {
      console.error("Payment Error:", error);
      swal("Error", "Payment failed. Please try again.", "error");
    }
  };

  useEffect(() => {
    const fetchUserAndBookings = async () => {
      setLoading(true);
      const fetchedUser = JSON.parse(localStorage.getItem("currentUser"));
      if (!fetchedUser) {
        redirectToLogin();
        return;
      }
      setUser(fetchedUser);
      setEditForm({
        name: fetchedUser.name || "",
        email: fetchedUser.email || "",
        password: "",
      });

      // Fetch bookings from the server
      try {
        const response = await axios.get(
          `/api/booking/user/${fetchedUser._id}`
        );
        const serverBookings = response.data;

        // Load bookings from local storage
        const localBookings =
          JSON.parse(localStorage.getItem("bookings")) || [];

        // Combine server and local bookings, and filter
        const allBookings = [...serverBookings, ...localBookings];
        const filteredBookings = allBookings.filter(
          (booking) =>
            booking.status === "booked" || booking.status === "Cancelled"
        );

        setBookings(filteredBookings);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch user data or bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndBookings();
  }, []);

  const redirectToLogin = () => {
    window.location.href = "/login";
  };

  const cancelBooking = async (bookingId, roomId) => {
    try {
      setLoading(true);
      const response = await axios.delete(`/api/booking/delete`, {
        data: { bookingid: bookingId, roomid: roomId },
      });

      if (response.status === 200) {
        const updatedBookings = bookings.filter(
          (booking) => booking._id !== bookingId
        );

        const canceledBooking = bookings.find(
          (booking) => booking._id === bookingId
        );
        if (canceledBooking) {
          canceledBooking.status = "Cancelled";
          localStorage.setItem(
            "bookings",
            JSON.stringify([...updatedBookings, canceledBooking])
          );
        } else {
          localStorage.setItem("bookings", JSON.stringify(updatedBookings));
        }

        setBookings(updatedBookings);
        swal("Success", "Your booking has been cancelled", "success");
      } else {
        swal(
          "Error",
          response.data.message || "Failed to cancel booking",
          "error"
        );
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      swal("Oops", "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async () => {
    // Check if all bookings are cancelled
    const allBookingsCancelled = bookings.every(
      (booking) => booking.status === "Cancelled"
    );

    if (!allBookingsCancelled) {
      swal(
        "Cannot Delete",
        "You have current bookings that are not cancelled. Please cancel them before deleting your account.",
        "warning"
      );
      return;
    }

    const confirm = await swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this account!",
      icon: "warning",
      buttons: ["Cancel", "Yes, Delete"],
      dangerMode: true,
    });

    if (confirm) {
      try {
        setLoading(true);
        await axios.delete("/api/user/delete", { data: { userId: user._id } });
        localStorage.removeItem("currentUser");
        swal("Deleted!", "Your account has been deleted.", "success").then(() =>
          redirectToLogin()
        );
      } catch (error) {
        console.error("Error deleting user:", error);
        swal("Oops!", "Something went wrong. Please try again.", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.put("/api/user/update", {
        userid: user._id,
        name: editForm.name,
        email: editForm.email,
        password: editForm.password,
      });

      const updatedUser = response.data;
      setUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      swal("Updated!", "Your profile has been updated.", "success");
      setIsEditingProfile(false);
    } catch (error) {
      console.error(error);
      swal("Oops", "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditBookingChange = (e) => {
    const { name, value } = e.target;
    setEditBookingForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleEditBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const fromDate = new Date(editBookingForm.fromdate);
      const toDate = new Date(editBookingForm.todate);

      if (isNaN(fromDate) || isNaN(toDate)) {
        swal("Error", "Invalid date format. Please use a valid date.", "error");
        return;
      }

      const totalDays = (toDate - fromDate) / (1000 * 60 * 60 * 24);
      if (totalDays < 0) {
        swal(
          "Error",
          "Check your dates. The 'From' date must be before the 'To' date.",
          "error"
        );
        return;
      }

      const bookingToEdit = bookings.find(
        (booking) => booking._id === editingBookingId
      );
      const roomId = bookingToEdit.roomid;
      const roomResponse = await axios.get(`/api/room/rooms/${roomId}`);
      const roomData = roomResponse.data;

      const totalPrice = totalDays * roomData.rentperday;

      console.log("Submitting booking update:", {
        userid: user._id,
        bookingId: editingBookingId,
        ...editBookingForm,
        totalDays,
        totalAmount: totalPrice,
      });

      // Send booking update
      const response = await axios.put("/api/booking/update", {
        userid: user._id,
        bookingId: editingBookingId,
        ...editBookingForm,
        totalDays,
        totalAmount: totalPrice,
      });

      // Update local state
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === editingBookingId
            ? {
                ...booking,
                ...editBookingForm,
                totalDays,
                totalAmount: totalPrice,
              }
            : booking
        )
      );

      swal("Updated!", "Booking has been updated.", "success");
      setEditingBookingId(null);
      setEditBookingForm({ room: "", roomid: "", fromdate: "", todate: "" });
    } catch (error) {
      console.error("Error updating booking:", error);
      const message =
        error.response?.data?.message || "Oops, something went wrong.";
      swal("Oops", message, "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-20 flex justify-center items-center h-screen">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-20 flex justify-center items-center min-h-screen text-red-500">
        <Error />
      </div>
    );
  }

  if (!user) {
    return null; // Or handle a different state
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-10 mt-20">
      <div className="w-full max-w-4xl space-y-8 bg-gradient-to-r from-blue-50 to-purple-50 ">
        {/* Profile Information */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl  shadow-lg p-10 space-y-8 text-center max-w-lg mx-auto">
          <h1 className="text-3xl font-extrabold tracking-wide text-gray-800">
            MY PROFILE
          </h1>
          {isEditingProfile ? (
            <form onSubmit={handleEditSubmit} className="space-y-6">
              {["name", "email", "password"].map((field) => (
                <div key={field} className="flex flex-col space-y-2">
                  <label className="text-lg font-semibold text-gray-700">
                    {field.charAt(0).toUpperCase() + field.slice(1)}:
                  </label>
                  <input
                    type={field === "password" ? "password" : "text"}
                    name={field}
                    value={editForm[field]}
                    onChange={handleEditChange}
                    className="p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  />
                </div>
              ))}
              <button
                type="submit"
                className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="w-full py-3 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition duration-300"
              >
                Cancel
              </button>
            </form>
          ) : (
            <>
              <div className="flex flex-col items-center space-y-6">
                <img
                  src="https://www.thenews.com.pk/assets/uploads/updates/2023-05-20/1072298_3040850_karina2_updates.jpg"
                  alt="User"
                  className="w-24 h-24 rounded-full border-4  shadow-lg object-cover"
                />
                <h1 className="text-3xl font-bold tracking-wider text-indigo-700">
                  {user.name}
                </h1>
                <p className="text-lg text-gray-600">{user.email}</p>
              </div>
            </>
          )}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 md:items-center md:justify-center mt-6">
            <button
              onClick={() => setIsEditingProfile(true)}
              className="px-6 py-3 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 transition duration-300 w-full md:w-auto"
            >
              Edit Profile <FaEdit className="inline-block ml-2" />
            </button>
            <button
              onClick={deleteUser}
              className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-300 w-full md:w-auto"
            >
              Delete Account
              <FaTrash className="inline-block ml-2" />
            </button>
          </div>
        </div>

        {/* Booking Information */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl shadow-lg p-8 space-y-8">
          <h2 className="text-3xl font-extrabold text-gray-800 tracking-wider text-center">
            MY BOOKINGS
          </h2>
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <div
                key={booking._id}
                className={`border-b-2 p-6 rounded-xl shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center transition duration-300 ease-in-out ${
                  booking.status === "Cancelled"
                    ? "bg-red-100"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-indigo-700">
                    {booking.room}
                  </h3>
                  <p className="text-gray-600 mt-2">
                    <strong>From: </strong>
                    {booking.fromdate}
                  </p>
                  <p className="text-gray-600">
                    <strong>To: </strong>
                    {booking.todate}
                  </p>
                  <p className="text-gray-600">
                    <strong>Total Amount:</strong>{" "}
                    {booking.totalAmount || "N/A"} THB
                  </p>
                  <p className="text-gray-600">
                    <strong>Total Days:</strong> {booking.totalDays || "N/A"}{" "}
                    days
                  </p>
                  <div className="flex items-center mt-2">
                    <strong className="text-gray-600">Status : </strong>
                    <span
                      className={`px-3 py-1 ml-2 text-xs font-semibold rounded-full ${
                        booking.status === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>

                {booking.status !== "Cancelled" && (
                  <div className="flex space-x-4 mt-4 md:mt-0">
                    <button
                      onClick={() => {
                        setEditingBookingId(booking._id);
                        setEditBookingForm({
                          room: booking.room,
                          roomid: booking.roomid,
                          fromdate: booking.fromdate,
                          todate: booking.todate,
                        });
                      }}
                      className="px-4 py-2 flex items-center space-x-2 bg-indigo-600 text-white hover:bg-indigo-700 shadow-md rounded-lg transition duration-300"
                    >
                      <FaEdit />
                      <span className="hidden md:inline">Edit</span>{" "}
                      {/* Hidden on mobile */}
                    </button>
                    <button
                      onClick={() => cancelBooking(booking._id, booking.roomid)}
                      className="px-4 py-2 flex items-center space-x-2 bg-red-500 text-white hover:bg-red-600 shadow-md rounded-lg transition duration-300"
                    >
                      <FaTrash />
                      <span className="hidden md:inline">
                        Cancel Booking
                      </span>{" "}
                      {/* Hidden on mobile */}
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-lg">No bookings found.</p>
          )}
        </div>

        {/* Edit Booking Modal */}
        {editingBookingId && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-2xl p-10 max-w-lg w-full">
              <h2 className="text-3xl font-extrabold text-indigo-700 mb-6">
                Edit Booking
              </h2>
              <form onSubmit={handleEditBookingSubmit} className="space-y-6">
                {["room", "fromdate", "todate"].map((field) => (
                  <div key={field} className="flex flex-col space-y-2">
                    <label className="text-lg font-semibold text-gray-700">
                      {field.charAt(0).toUpperCase() + field.slice(1)}:
                    </label>
                    <input
                      type={field.includes("date") ? "date" : "text"}
                      name={field}
                      value={editBookingForm[field]}
                      onChange={handleEditBookingChange}
                      className="p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    />
                  </div>
                ))}
                <button
                  type="submit"
                  className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingBookingId(null)}
                  className="w-full py-3 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition duration-300"
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
