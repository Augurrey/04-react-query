import axios from "axios";
import type { Movie } from "../types/movie";

interface SearchMoviesResponse {
  results: Movie[];
  total_pages: number;
  page: number;
}

const token = import.meta.env.VITE_TMDB_TOKEN;
const url = "https://api.themoviedb.org/3/search/movie";

export default async function searchMovies(
  query: string,
  page: number,
): Promise<SearchMoviesResponse> {
  const response = await axios.get<SearchMoviesResponse>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      query,
      page,
    },
  });

  return response.data;
}
