import axios from "axios";
import type { Movie } from "../types/movie";

const API_URL = "https://api.themoviedb.org/3/search/movie";
const API_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

interface FetchMoviesResponse {
  results: Movie[];
}

export const getMovies = async (query: string): Promise<Movie[]> => {
  const config = {
    params: {
      query,
      include_adult: false,
      language: "en-US",
      page: 1,
    },
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      accept: "application/json",
    },
  };

  const response = await axios.get<FetchMoviesResponse>(API_URL, config);
  return response.data.results;
};
