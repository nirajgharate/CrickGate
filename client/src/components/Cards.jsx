import React from 'react';
import turfImg from '../assets/Cards.png';
import { FaRupeeSign, FaStar } from "react-icons/fa";

export default function Cards() {
  return (
    <div className="border-2 border-gray-300 p-2 w-full mx-2 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
      <div
        className="relative w-full h-60 bg-cover bg-center rounded-2xl mx-auto mt-3"
        style={{ backgroundImage: `url(${turfImg})` }}
      >
        {/* ⭐ Review and rating */}
        <div className="absolute bottom-2 left-2 flex items-center bg-black/60 text-white text-sm px-2 py-1 rounded-md">
          <FaStar className="text-yellow-400 mr-1" />
          <span>4.5</span>
          <span className="ml-2 text-gray-300">(120 reviews)</span>
        </div>
      </div>

      <div className="p-4 text-black">
        <h2 className="text-xl font-semibold">Battle Ground</h2>
        <p className="mt-2">Pimpalgaon Bahula Nashik</p>
        <p className="flex items-center mt-4">
          <FaRupeeSign />900 per hour
        </p>
      </div>
    </div>
  );
}
