import React from 'react'

const Search = ({ searchTerm, setSearchTerm, onSearch }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search">
      <div>
        <img src="search.svg" alt="search" />
        <input 
          type="text" 
          placeholder="Search through thousands of movies" 
          value={searchTerm} 
          onChange={(event) => setSearchTerm(event.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button type="submit" className="sr-only">Search</button>
      </div>
    </form>
  )
}

export default Search