import React from 'react';

const MovieCard = ({ movie }) => {
  const posterBaseUrl = 'https://image.tmdb.org/t/p/w500';
  
  return (
    <div className="movie-card bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="poster-container">
        {movie.poster_path ? (
          <img 
            src={`${posterBaseUrl}${movie.poster_path}`}
            alt={`${movie.title} poster`}
            className="w-full h-64 object-cover"
            onError={(e) => {
              e.target.src = '/no-movie.png';
            }}
          />
        ) : (
          <div className="w-full h-64 bg-gray-700 flex items-center justify-center">
            <img 
              src="/no-movie.png" 
              alt="No poster available"
              className="w-16 h-16 opacity-50"
            />
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
          {movie.title}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">
            {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
          </span>
          {movie.vote_average && (
            <div className="flex items-center">
              <img src="/star.svg" alt="star" className="w-4 h-4 mr-1" />
              <span className="text-yellow-400 text-sm font-medium">
                {movie.vote_average.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieCard; 