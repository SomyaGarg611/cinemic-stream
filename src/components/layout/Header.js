import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleNav, closeNav } from '../../redux/slices/uiSlice';
import { setSearchType, searchMedia } from '../../redux/slices/searchSlice';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isNavOpen } = useSelector(state => state.ui);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Submitting search query:', searchQuery.trim());
      const query = searchQuery.trim();
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setSearchQuery('');
      setSearchFocused(false);
      dispatch(closeNav());
      
      // Pre-dispatch the search action to start loading results
      dispatch(searchMedia({ 
        query: query, 
        type: 'multi', 
        page: 1 
      }));
    }
  };

  const handleNavToggle = () => {
    dispatch(toggleNav());
  };

  return (
    <header className="bg-primary shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center flex-shrink-0" onClick={() => dispatch(closeNav())}>
          <h1 className="text-xl md:text-2xl font-bold text-accent">CINEMIC</h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <Link to="/movies" className="text-white hover:text-accent transition-colors">
            Movies
          </Link>
          <Link to="/tv-shows" className="text-white hover:text-accent transition-colors">
            TV Shows
          </Link>
          <Link to="/trending" className="text-white hover:text-accent transition-colors">
            Trending
          </Link>
        </nav>

        {/* Search Bar - Now visible on all screen sizes */}
        <div className="relative flex-1 max-w-xs md:max-w-md mx-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search movies, TV shows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              className={`bg-secondary text-white py-2 px-4 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-accent text-sm md:text-base ${
                searchFocused ? 'ring-2 ring-accent' : ''
              }`}
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-accent"
              aria-label="Search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
          {searchFocused && (
            <div className="absolute top-12 right-0 bg-secondary py-2 rounded-md shadow-lg w-full max-w-64 z-10">
              <div className="px-4 py-1 text-sm text-white font-semibold">Quick Navigation:</div>
              <Link
                to="/movies"
                className="block w-full text-left px-4 py-1 text-sm text-white hover:bg-primary"
                onClick={() => {
                  setSearchFocused(false);
                  dispatch(closeNav());
                }}
              >
                Movies
              </Link>
              <Link
                to="/tv-shows" 
                className="block w-full text-left px-4 py-1 text-sm text-white hover:bg-primary"
                onClick={() => {
                  setSearchFocused(false);
                  dispatch(closeNav());
                }}
              >
                TV Shows
              </Link>
              <Link
                to="/trending"
                className="block w-full text-left px-4 py-1 text-sm text-white hover:bg-primary"
                onClick={() => {
                  setSearchFocused(false);
                  dispatch(closeNav());
                }}
              >
                Trending
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none flex-shrink-0"
          onClick={handleNavToggle}
          aria-label={isNavOpen ? 'Close Menu' : 'Open Menu'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isNavOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Mobile Navigation */}
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300 ${
            isNavOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => dispatch(closeNav())}
        >
          <div
            className={`fixed top-0 right-0 w-64 h-full bg-secondary shadow-xl transform transition-transform duration-300 ease-in-out ${
              isNavOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-accent">CINEMIC</h2>
                <button
                  className="text-white"
                  onClick={() => dispatch(closeNav())}
                  aria-label="Close Menu"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <nav className="flex flex-col space-y-4">
                <Link
                  to="/"
                  className="text-white hover:text-accent transition-colors"
                  onClick={() => dispatch(closeNav())}
                >
                  Home
                </Link>
                <Link
                  to="/movies"
                  className="text-white hover:text-accent transition-colors"
                  onClick={() => dispatch(closeNav())}
                >
                  Movies
                </Link>
                <Link
                  to="/tv-shows"
                  className="text-white hover:text-accent transition-colors"
                  onClick={() => dispatch(closeNav())}
                >
                  TV Shows
                </Link>
                <Link
                  to="/trending"
                  className="text-white hover:text-accent transition-colors"
                  onClick={() => dispatch(closeNav())}
                >
                  Trending
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
