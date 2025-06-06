'use client'

import Banner from "@/components/Banner"
import { useEffect, useState } from "react";
import { BASE_URL, API_KEY } from '../config';
import axios from 'axios';
import MovieCard from "@/components/MovieCard";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import { AiOutlineLoading } from "react-icons/ai";



// Genre data
const GENRES = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science, Fiction" },
  { id: 10770, name: "TV " },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" }
];

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [genreName, setGenreName] = useState("Popular Movies");
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('')

  const divs = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
  ]

  /* Fetching Movies from the api */
  const fetchMovies = async (url) => {
    setIsLoading(true);
    try {
      const response = await axios.get(url);
      setMovies(response.data.results);
    } catch (err) {
      console.error('Error fetching movies:', err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (selectedGenre) {
      fetchMovies(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${selectedGenre}`);
      const genre = GENRES.find(g => g.id === selectedGenre);
      setGenreName(genre ? `${genre.name} Movies` : "Popular Movies");
    } else {
      fetchMovies(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
      setGenreName("Popular Movies");
    }
  }, [selectedGenre]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() === '') {
      alert('Please enter a movie name to search.')
    } else {
      fetchMovies(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchQuery)}`);
      setGenreName(`Search Results for "${searchQuery}"`);
      setSearchQuery('');
    }
  }

  return (
    <>
      {isLoading ? (
        <div >
          <div className="w-full h-[400px] bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
        </div>
      ) : (
        movies.length > 0 && (
          <Banner movie={movies[Math.floor(Math.random() * movies.length)]} />
        )
      )}

      {/* Search Bar Section */}
      <div className="flex justify-center gap-3 items-center mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for movies..."
          className="w-full max-w-md px-4 py-2 rounded-l-lg bg-gray-50 text-gray-800 placeholder-gray-500 shadow focus:outline-none"
        />
        <button
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-r-lg flex items-center"
          onClick={handleSearch}
        >
          <FaSearch />
        </button>
      </div>

      {/* Genre Filter Section */}
      <div className=" p-4 md:sticky top-0 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedGenre(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${!selectedGenre
                ? 'bg-red-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
            >
              Popular
            </motion.button>
            {GENRES.map((genre) => (
              <motion.button
                whileTap={{ scale: 0.95 }}
                key={genre.id}
                onClick={() => setSelectedGenre(genre.id)}
                className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium ${selectedGenre === genre.id
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
              >
                {genre.name}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Movies Section */}
      <div className="max-w-7xl mx-auto">
        <div className="text-white text-center text-3xl md:text-4xl font-bold p-4">
          {genreName}
        </div>

        {isLoading && movies.length < 0 ? (
          <div className="bg-gray-800 w-[100px] h-[100px]"></div>
        ) : (
          <MovieCard movie={movies} />
        )}

        {isLoading ? (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse h-32" />
            ))}
          </div>
        ) : (
          <MovieCard movie={movies} />
        )}
      </div>
    </>
  )
}