'use client'

import { IMAGE_BASE_URL } from "@/config";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FaYoutube } from "react-icons/fa";
import { BASE_URL, API_KEY } from '../config';

export default function MovieCard({ movie, isLoading }) {
  const [activeCard, setActiveCard] = useState(null);
  const [trailers, setTrailers] = useState({});
  const [open, setOpen] = useState(false);
  const [currentTrailer, setCurrentTrailer] = useState('');

  useEffect(() => {
    const fetchTrailers = async () => {
      try {
        const trailerPromises = movie.map(async (item) => {
          let type = 'movie';
          if (item.first_air_date) {
            type = 'tv';
          }
          const response = await axios.get(
            `${BASE_URL}/${type}/${item.id}/videos?api_key=${API_KEY}`
          );
          console.log(response.data)
          const itemTrailers = response.data.results.filter(
            (video) => video.type === 'Trailer' && video.site === 'YouTube'
          );
          return { id: item.id, key: itemTrailers[0]?.key };
        });

        const results = await Promise.all(trailerPromises);
        const trailerMap = results.reduce((acc, { id, key }) => {
          if (key) acc[id] = key;
          return acc;
        }, {});

        setTrailers(trailerMap);
      } catch (err) {
        console.error('Error fetching trailers: ', err);
      }
    };

    if (movie?.length > 0) {
      fetchTrailers();
    }
  }, [movie]);

  const handlePlayTrailer = (e, id) => {
    e.stopPropagation();
    const trailerKey = trailers[id];
    if (trailerKey) {
      setCurrentTrailer(trailerKey);
      setOpen(true);
    } else {
      alert('Trailer not available');
    }
  };

  const handleCardInteraction = (id) => {
    setActiveCard(id);
    setTimeout(() => setActiveCard(null), 3000);
  };

  const handleWatchNow = (e, id) => {
    e.stopPropagation();
    window.open(`https://www.themoviedb.org/movie/${id}/watch?locale=US`, '_blank');
  };

  return (
    <>
      {/* Trailer Modal */}
      {open && currentTrailer && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6 mt-5">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={() => setOpen(false)}
              className="absolute -top-10 right-0 text-white text-2xl"
            >
              &times;
            </button>
            <iframe
              width="100%"
              height="500"
              src={`https://www.youtube.com/embed/${currentTrailer}?autoplay=1`}
              title="YouTube trailer"
              allow="autoplay;"
              allowFullScreen
              className="rounded-xl"
            ></iframe>
          </div>
        </div>
      )}

      {/* Movie Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4">
        {isLoading ? (
          <div className="bg-gray-800 w-[100px] h-[100px]"></div>
        ) : movie?.length > 0 ? (
          movie.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
              onClick={() => handleCardInteraction(item.id)}
              onMouseEnter={() => setActiveCard(item.id)}
              onMouseLeave={() => setActiveCard(null)}
            >
              <img
                src={item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : '/placeholder.jpg'}
                alt={item.title || item.name}
                className="w-full h-auto aspect-[2/3] object-cover"
                loading="lazy"
              />

              <div className={`
                absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent
                ${activeCard === item.id ? 'opacity-100' : 'opacity-0 sm:group-hover:opacity-100'}
                transition-opacity duration-300 flex flex-col justify-end p-3
              `}>
                <h3 className="text-white font-semibold text-sm truncate">
                  {item.title || item.name}
                </h3>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-300">
                    {item.release_date?.substring(0, 4) || item.first_air_date?.substring(0, 4)}
                  </span>
                  <span className="text-xs bg-yellow-500 text-black px-1.5 py-0.5 rounded font-bold">
                    {item.vote_average?.toFixed(1)}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className={`flex gap-2 mt-2 transition-all duration-300
                  ${activeCard === item.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
                >
                  <button
                    onClick={(e) => handleWatchNow(e, item.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-1 rounded text-xs font-medium"
                  >
                    Watch Now
                  </button>
                  <button
                    onClick={(e) => handlePlayTrailer(e, item.id)}
                    className="bg-white hover:bg-gray-200 text-red-600 p-1 rounded text-xs"
                    title="Play Trailer"
                  >
                    <FaYoutube className="text-lg" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-white py-10">
            No movies found
          </div>
        )}
      </div>
    </>
  );
}