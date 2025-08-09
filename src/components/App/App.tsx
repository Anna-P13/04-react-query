import { useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import { getMovies } from "../../services/movieService";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import toast, { Toaster } from "react-hot-toast";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import type { Movie } from "../../types/movie";
import css from "./App.module.css";

const notify = () => toast.error("No movies found for your request.");

export default function App() {
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearch = async (userSearch: string) => {
    setError(null);
    setLoader(true);
    setMovies([]);

    try {
      const response = await getMovies(userSearch);

      if (!Array.isArray(response) || response.length === 0) {
        setMovies([]);
        notify();
      } else {
        setMovies(response);
      }
    } catch (err) {
      setMovies([]);
      setError(err as Error);
      console.error(err);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />

      <MovieGrid
        movies={movies}
        onSelect={(movie) => setSelectedMovie(movie)}
      />

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}

      {loader && <Loader />}
      {error && <ErrorMessage />}

      <Toaster />
    </div>
  );
}