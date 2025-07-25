import { useState, useEffect } from "react"
import Search from "./components/Search.jsx"
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";

const API_BASE_URL = 'https://api.themoviedb.org/3'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  const fetchMovies = async (page = 1) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${page}`;

      const response = await fetch(endpoint, API_OPTIONS);

      if(!response.ok) {
        throw new Error('Failed to fetch movies');
      }
      const data = await response.json();
      
      console.log('API Response Data:', data);

      if(data.Response === 'False'){
        setErrorMessage(data.Error || 'Failed to fetch movies');
        setMovieList([]);
        return
      }
      setMovieList(data.results || []);
      setTotalPages(data.total_pages || 0);
      setCurrentPage(page);
    } catch {
      console.error('Error fetching movies: ${error}');
      setErrorMessage('Error fetching movies. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(()=> {
    fetchMovies(currentPage);
  },[currentPage])

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    if (isSearching) {
      searchMovies(searchTerm, newPage);
    } else {
      fetchMovies(newPage);
    }
  };

  const searchMovies = async (query, page = 1) => {
    setIsLoading(true);
    setErrorMessage('');
    setIsSearching(true);
    try {
      const endpoint = `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}`;

      const response = await fetch(endpoint, API_OPTIONS);

      if(!response.ok) {
        throw new Error('Failed to search movies');
      }
      const data = await response.json();

      console.log('Search API Response Data:', data);

      if(data.Response === 'False'){
        setErrorMessage(data.Error || 'No movies found');
        setMovieList([]);
        return
      }
      setMovieList(data.results || []);
      setTotalPages(data.total_pages || 0);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error searching movies:', error);
      setErrorMessage('Error searching movies. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query) => {
    if (query.trim()) {
      searchMovies(query, 1);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setIsSearching(false);
    setCurrentPage(1);
    fetchMovies(1);
  };
  return (
    <main>
      <div className="pattern"/>
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy Without The Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearch={handleSearch} />
        </header>
        <section>
          <div className="flex justify-between items-center mt-[40px]">
            <h2>{isSearching ? `Search Results for "${searchTerm}"` : 'All Movies'}</h2>
            {isSearching && (
              <button
                onClick={handleClearSearch}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
          {isLoading ? (
            <Spinner/>
          ): errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {movieList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-8 gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
                  >
                    Previous
                  </button>
                  
                  <span className="px-4 py-2 text-white">
                    Page {currentPage} of {totalPages}
                  </span>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </section>
        
      </div>
    </main>
  )
}

export default App
