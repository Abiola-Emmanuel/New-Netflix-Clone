'use client'

import { useState } from "react";
import { IMAGE_BASE_URL } from "../config";
import { FaPlayCircle } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Banner({ movie }) {

  const handleWatchNow = (e, id) => {
    e.stopPropagation();
    window.open(`https://www.themoviedb.org/movie/${id}/watch?locale=US`, '_blank');
  };

  return (
    <div className="relative">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30 z-0" />

      {/* Background image */}
      <div className="w-full h-[450px] md:h-[530px] lg:h-[530px] overflow-hidden">
        <img
          className="w-full h-full object-cover lazy-load"
          src={`${IMAGE_BASE_URL}${movie.backdrop_path}`}
          alt={movie.title || movie.name}
        />
      </div>

      {/* Content - positioned below navbar */}
      <div className="absolute bottom-10 left-5 md:left-10 max-w-[500px] z-10">
        <h1 className="text-3xl md:text-5xl font-bold mb-2 text-white drop-shadow-lg">
          {movie.title || movie.name}
        </h1>
        <p className="text-sm md:text-lg mb-4 text-gray-200 line-clamp-3">
          {movie.overview}
        </p>
        <div className="flex gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 cursor-pointer"
            onClick={(e) => handleWatchNow(e, movie.id)}
          >
            <FaPlayCircle className="text-xl" />
            Watch Now
          </motion.button>
          {/*           <button className="bg-gray-600/70 hover:bg-gray-600/90 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2">
              <FaPlus className="text-xl" />
              My List
            </button> */}
        </div>
      </div>
    </div>
  )
}

