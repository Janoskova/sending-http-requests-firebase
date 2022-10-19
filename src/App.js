import React, { useState, useEffect, useCallback } from 'react';

import MoviesList from './components/MoviesList';
import AddMovie from './components/AddMovie';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        'https://react-http-1749b-default-rtdb.europe-west1.firebasedatabase.app/movies.json',
      );
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const data = await response.json();

      const fetchedMovies = [];

      for (const key in data) {
        fetchedMovies.push({
          id: data[key].id,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }

      setMovies(fetchedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  //we could also add error handling with try and catch
  async function addMovieHandler(movie) {
    const response = await fetch(
      'https://react-http-1749b-default-rtdb.europe-west1.firebasedatabase.app/movies.json',
      {
        method: 'POST', //by default is GET
        body: JSON.stringify(movie), //it takes JS object or array and turns it into JSON format
        headers: {
          'Content-Type': 'application/json', //not required for Firebase but a lot of APIs require it
        },
      },
    );
    const data = await response.json(); // we can see the response in the console (auto-generated ID by Firebase)
  }

  let content = <p>Found no movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
