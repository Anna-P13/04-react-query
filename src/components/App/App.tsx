import SearchBar from "../SearchBar/SearchBar";
import { fetchMovies } from "../../services/movieService";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import toast, { Toaster } from "react-hot-toast";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import type { Movie } from "../../types/movie";
import css from "./App.module.css";

import {useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useQuery, keepPreviousData } from "@tanstack/react-query";


export default function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isMovieModalOpen, setIsMovieModalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const openModal = () => setIsMovieModalOpen(true);
  const closeModal = () => {
    setIsMovieModalOpen(false);
    setSelectedMovie(null);
  };
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query !== "",
    placeholderData: keepPreviousData,
  });

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    openModal();
  };

  const handleSubmit = async (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  };

  const totalPages = data?.total_pages ?? 0;

   useEffect(() => {
    if (isSuccess && data?.results.length === 0) {
      toast.error("No movie found for your request.");
    }
  }, [isSuccess, data]);

  return (
    <div className={css.app}>
      <Toaster position="top-center" />
      <SearchBar onSubmit={handleSubmit} />
      {isSuccess && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {isSuccess && data.results.length > 0 && (
        <MovieGrid onSelect={handleSelectMovie} movies={data.results} />
      )}
      {isMovieModalOpen && selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
    </div>
  );
}