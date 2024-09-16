"use client";

import React, { useState } from "react";
import { DatePicker } from "antd";
import "antd/dist/reset.css"; // Import Ant Design styles

const { RangePicker } = DatePicker;

const Home = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

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
                    setFromDate(dates[0].format("DD-MM-YYYY"));
                    setToDate(dates[1].format("DD-MM-YYYY"));
                  } else {
                    setFromDate("");
                    setToDate("");
                  }
                }}
              />
            </div>
            <div className="w-full md:w-auto">
              <input
                type="text"
                className="w-full h-10 px-4 rounded-lg text-gray-800"
                placeholder="Search Rooms"
              />
            </div>
            <div className="w-full md:w-auto">
              <select className="w-full h-10 px-4 rounded-lg text-gray-800">
                <option value="all">All</option>
                <option value="delux">Delux</option>
                <option value="suite">Suite</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10">
        {/* Replace with static data for rooms */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          <div className="border p-4 rounded-lg">
            <img
              src="https://t3.ftcdn.net/jpg/02/71/08/28/360_F_271082810_CtbTjpnOU3vx43ngAKqpCPUBx25udBrg.jpg"
              alt="Delux Room"
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
            <h2 className="text-2xl font-bold">Delux Room</h2>
            <p className="text-gray-600">Delux</p>
            <p className="text-lg text-gray-900 font-semibold">
              2000 Baht/night
            </p>
          </div>
          <div className="border p-4 rounded-lg">
            <img
              src="https://t3.ftcdn.net/jpg/02/71/08/28/360_F_271082810_CtbTjpnOU3vx43ngAKqpCPUBx25udBrg.jpg"
              alt="Suite Room"
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
            <h2 className="text-2xl font-bold">Delux Room</h2>
            <p className="text-gray-600">Delux</p>
            <p className="text-lg text-gray-900 font-semibold">
              3000 Baht/night
            </p>
          </div>
          <div className="border p-4 rounded-lg">
            <img
              src="https://t3.ftcdn.net/jpg/02/71/08/28/360_F_271082810_CtbTjpnOU3vx43ngAKqpCPUBx25udBrg.jpg"
              alt="President Room"
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
            <h2 className="text-2xl font-bold">Delux Room</h2>
            <p className="text-gray-600">Delux</p>
            <p className="text-lg text-gray-900 font-semibold">
              5000 Baht/night
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
