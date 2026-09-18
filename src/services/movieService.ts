import axios from "axios";
import type { Movie } from "../types/movie";

interface SearchMoviesResponse {
  results: Movie[];
}

const token = import.meta.env.VITE_TMDB_TOKEN;
const url = "https://api.themoviedb.org/3/search/movie?query=";

export default async function searchMovies(query: string): Promise<Movie[]> {
  const response = await axios.get<SearchMoviesResponse>(`${url}${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.results;
}
