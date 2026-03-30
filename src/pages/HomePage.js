import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrendingMovies, fetchMoviesByCategory } from 'redux/slices/moviesSlice';
import { fetchTrendingTvShows, fetchTvShowsByCategory } from 'redux/slices/tvShowsSlice';
import { getImageUrl } from 'utils/helpers';
import Slider from 'components/common/Slider';
import MediaCard from 'components/common/MediaCard';
import LoadingSpinner from 'components/common/LoadingSpinner';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const dispatch = useDispatch();
  const { trending: trendingMovies, popular: popularMovies, status: moviesStatus } = useSelector(state => state.movies);
  const { trending: trendingTvShows, popular: popularTvShows, status: tvShowsStatus } = useSelector(state => state.tvShows);
  
  // Get a random trending item for the hero banner
  const randomTrendingItem = trendingMovies?.length > 0 
    ? trendingMovies[Math.floor(Math.random() * trendingMovies.length)]
    : null;

  useEffect(() => {
    dispatch(fetchTrendingMovies('day'));
    dispatch(fetchTrendingTvShows('day'));
    dispatch(fetchMoviesByCategory({ category: 'popular', page: 1 }));
    dispatch(fetchTvShowsByCategory({ category: 'popular', page: 1 }));
  }, [dispatch]);

  const isLoading = moviesStatus === 'loading' || tvShowsStatus === 'loading';

  return (
    <div>
      {/* Hero Banner */}
      {randomTrendingItem && (
        <div className="relative h-96 md:h-[70vh]">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${getImageUrl(randomTrendingItem.backdrop_path, 'original')})`,
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-transparent to-transparent"></div>
          
          <div className="relative h-full container mx-auto px-4 flex flex-col justify-end pb-12">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{randomTrendingItem.title || randomTrendingItem.name}</h1>
            <p className="text-white text-sm md:text-base max-w-2xl mb-6 line-clamp-3">{randomTrendingItem.overview}</p>
            <div className="flex space-x-4">
              <Link 
                to={`/${randomTrendingItem.title ? 'movie' : 'tv'}/${randomTrendingItem.id}`}
                className="bg-accent hover:bg-accent-dark text-white px-6 py-2 rounded-full transition-colors duration-300 font-medium"
              >
                Watch Now
              </Link>
              <Link 
                to={`/${randomTrendingItem.title ? 'movie' : 'tv'}/${randomTrendingItem.id}`}
                className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-full transition-colors duration-300 font-medium"
              >
                More Info
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <LoadingSpinner size="large" />
        ) : (
          <>
            {/* Trending Movies */}
            {trendingMovies?.length > 0 && (
              <Slider title="Trending Movies">
                {trendingMovies.map((movie) => (
                  <div key={movie.id} className="flex-none w-32 md:w-40 lg:w-48">
                    <MediaCard item={movie} mediaType="movie" />
                  </div>
                ))}
              </Slider>
            )}

            {/* Popular Movies */}
            {popularMovies?.length > 0 && (
              <Slider title="Popular Movies">
                {popularMovies.map((movie) => (
                  <div key={movie.id} className="flex-none w-32 md:w-40 lg:w-48">
                    <MediaCard item={movie} mediaType="movie" />
                  </div>
                ))}
              </Slider>
            )}

            {/* Trending TV Shows */}
            {trendingTvShows?.length > 0 && (
              <Slider title="Trending TV Shows">
                {trendingTvShows.map((show) => (
                  <div key={show.id} className="flex-none w-32 md:w-40 lg:w-48">
                    <MediaCard item={show} mediaType="tv" />
                  </div>
                ))}
              </Slider>
            )}

            {/* Popular TV Shows */}
            {popularTvShows?.length > 0 && (
              <Slider title="Popular TV Shows">
                {popularTvShows.map((show) => (
                  <div key={show.id} className="flex-none w-32 md:w-40 lg:w-48">
                    <MediaCard item={show} mediaType="tv" />
                  </div>
                ))}
              </Slider>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
