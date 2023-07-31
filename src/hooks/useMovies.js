import { useState, useEffect } from 'react';

const KEY = '43bcbc5c';

export const useMovies = query => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    const controller = new AbortController();

    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal }
        );

        if (!response.ok)
          throw new Error('Something went wrong with fetching movies');

        const data = await response.json();

        if (data.Response === 'False') throw new Error('Movie not found');

        setMovies(data.Search);
        setError('');
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.log('Error : ', error.message);
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    if (query.length < 3) {
      setMovies([]);
      setError('');
      return;
    }

    fetchMovies();

    return () => {
      controller.abort();
    };
  }, [query]);
  return { movies, loading, error };
};
