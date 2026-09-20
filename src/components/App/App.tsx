import styles from "./App.module.css";
import searchMovies from "../../services/movieService";
import SearchBar from "../SearchBar/SearchBar";
import toast, { Toaster } from "react-hot-toast";
import type { Movie } from "../../types/movie";
import { useEffect, useState } from "react";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Loader from "../Loader/Loader";
import { useQuery } from "@tanstack/react-query";

import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import type { ComponentType } from "react";

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;

export default function App() {
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearch = (value: string) => {
    if (value) setSearchValue(value);
    setPage(1);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["movies", searchValue, page],
    queryFn: () => searchMovies(searchValue, page),
    enabled: Boolean(searchValue),
  });

  useEffect(() => {
    if (data && data.results.length === 0) {
      toast.error("No movies found for your request.", {
        duration: 2000,
        position: "top-center",
      });
    }
  }, [data]);

  return (
    <div className={styles.app}>
      <Toaster />

      <SearchBar onSubmit={handleSearch} />

      {isLoading && <Loader />}

      {isError && <ErrorMessage />}

      {data && data.results.length > 0 && (
        <>
          <ReactPaginate
            pageCount={data.total_pages}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            onPageChange={({ selected }) => setPage(selected + 1)}
            forcePage={page - 1}
            containerClassName={styles.pagination}
            activeClassName={styles.active}
            nextLabel="→"
            previousLabel="←"
          />

          <MovieGrid movies={data.results} onSelect={setSelectedMovie} />
        </>
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
