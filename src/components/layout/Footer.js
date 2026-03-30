import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  // Function to scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-primary mt-auto py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-accent mb-4">CINEMIC</h3>
            <p className="text-gray-300 text-sm">
              Your ultimate destination for streaming movies and TV shows with comprehensive details,
              trailers, and a seamless viewing experience.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Explore</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/movies" onClick={scrollToTop} className="text-gray-300 hover:text-accent text-sm transition-colors">
                  Movies
                </Link>
              </li>
              <li>
                <Link to="/tv-shows" onClick={scrollToTop} className="text-gray-300 hover:text-accent text-sm transition-colors">
                  TV Shows
                </Link>
              </li>
              <li>
                <Link to="/trending" onClick={scrollToTop} className="text-gray-300 hover:text-accent text-sm transition-colors">
                  Trending
                </Link>
              </li>
              <li>
                <Link to="/search" onClick={scrollToTop} className="text-gray-300 hover:text-accent text-sm transition-colors">
                  Search
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Genres</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/genre/action" onClick={scrollToTop} className="text-gray-300 hover:text-accent text-sm transition-colors">
                  Action
                </Link>
              </li>
              <li>
                <Link to="/genre/comedy" onClick={scrollToTop} className="text-gray-300 hover:text-accent text-sm transition-colors">
                  Comedy
                </Link>
              </li>
              <li>
                <Link to="/genre/drama" onClick={scrollToTop} className="text-gray-300 hover:text-accent text-sm transition-colors">
                  Drama
                </Link>
              </li>
              <li>
                <Link to="/genre/sci-fi" onClick={scrollToTop} className="text-gray-300 hover:text-accent text-sm transition-colors">
                  Sci-Fi
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" onClick={scrollToTop} className="text-gray-300 hover:text-accent text-sm transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" onClick={scrollToTop} className="text-gray-300 hover:text-accent text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" onClick={scrollToTop} className="text-gray-300 hover:text-accent text-sm transition-colors">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link to="/contact" onClick={scrollToTop} className="text-gray-300 hover:text-accent text-sm transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-center items-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} CINEMIC. Designed and developed by Somya Garg.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
