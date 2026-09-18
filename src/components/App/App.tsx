import styles from "./App.module.css";
import searchMovies from "../../services/movieService";
import SearchBar from "../SearchBar/SearchBar";
import toast, { Toaster } from "react-hot-toast";
import type { Movie } from "../../types/movie";
import { useState } from "react";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Loader from "../Loader/Loader";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearch = async (query: string) => {
    if (!query) {
      setMovies([]);
      setIsError(false);
      return;
    }

    setIsLoading(true);
    setIsError(false);
    try {
      const results = await searchMovies(query);
      if (results.length === 0) {
        toast.error("No movies found for your request.", {
          duration: 2000,
        });
        setMovies([]);
        return;
      }
      setMovies(results);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className={styles.app}>
      <Toaster />
      <SearchBar onSubmit={handleSearch} />
      {isLoading && <Loader />}
      {isError ? (
        <ErrorMessage />
      ) : (
        <MovieGrid movies={movies} onSelect={setSelectedMovie} />
      )}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}
