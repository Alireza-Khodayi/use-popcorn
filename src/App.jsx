import { useState } from 'react';
import Navbar from './components/navbar/Navbar';
import Search from './components/navbar/Search';
import Results from './components/navbar/Results';
import Main from './components/UI/Main';
import MovieList from './components/MovieList';
import Box from './components/UI/Box';
import WatchedSummary from './components/WatchedSummary';
import WatchedMoviesList from './components/WatchedMoviesList';
import Loader from './components/UI/Loader';
import ErrorMessage from './components/UI/Error';
import MovieDetails from './components/MovieDetails';
import { useMovies } from './hooks/useMovies';
import { useLocalStorageState } from './hooks/useLocalStorageState';

// const KEY = '43bcbc5c';

export default function App() {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedID] = useState(null);

  // const [watched, setWatched] = useState(() => {
  //   const storedValue = localStorage.getItem('watched');
  //   return JSON.parse(storedValue);
  // });

  const { movies, loading, error } = useMovies(query);
  const [watched, setWatched] = useLocalStorageState([], 'watched');

  const handleSelectMovie = id => {
    setSelectedID(selectedId => (id === selectedId ? null : id));
  };

  const handleCloseMovie = () => {
    setSelectedID(null);
  };

  const handleAddWatched = movie => {
    setWatched(watched => [...watched, movie]);
  };

  const handleDeleteWatched = id => {
    setWatched(watched => watched.filter(movie => movie.imdbID !== id));
  };

  return (
    <>
      <Navbar>
        <Search query={query} setQuery={setQuery} />
        <Results movies={movies} />
      </Navbar>
      <Main>
        <Box>
          {loading && <Loader />}
          {!loading && !error && (
            <>
              {query.length < 3 ? (
                <p className="loader">Search For Movies...</p>
              ) : (
                <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
              )}
            </>
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
