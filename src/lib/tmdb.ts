import { Movie, MovieDetails, Credits, ApiResponse } from "@/types/movie";

const API_KEY = "cf3cf14ab604cc2ea727424afb521355";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export const tmdbConfig = {
  apiKey: API_KEY,
  baseUrl: BASE_URL,
  imageBaseUrl: IMAGE_BASE_URL,
};

export async function fetchPopularMovies(): Promise<Movie[]> {
  const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Failed to fetch popular movies");
  const data: ApiResponse<Movie> = await res.json();
  return data.results;
}

export async function fetchRecommendedMovies(
  movieId: number
): Promise<Movie[]> {
  const res = await fetch(
    `${BASE_URL}/movie/${movieId}/recommendations?api_key=${API_KEY}`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) throw new Error("Failed to fetch recommended movies");
  const data: ApiResponse<Movie> = await res.json();
  return data.results;
}

export async function fetchMovieDetails(
  movieId: number
): Promise<MovieDetails> {
  const res = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
  if (!res.ok) throw new Error("Failed to fetch movie details");
  return res.json();
}

export async function fetchMovieCredits(movieId: number): Promise<Credits> {
  const res = await fetch(
    `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`
  );
  if (!res.ok) throw new Error("Failed to fetch movie credits");
  return res.json();
}

export async function searchMovies(query: string): Promise<Movie[]> {
  if (!query.trim()) return [];
  const res = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
      query
    )}`
  );
  if (!res.ok) throw new Error("Failed to search movies");
  const data: ApiResponse<Movie> = await res.json();
  return data.results;
}

export function getImageUrl(
  path: string | null,
  size: "w92" | "w200" | "w300" | "w500" | "w780" | "original" = "w500"
): string {
  if (!path) return "/placeholder-movie.jpg";
  return `${IMAGE_BASE_URL}/${size}${path}`;
}

export function formatRuntime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}min`;
}

export function getAgeRestriction(adult: boolean): string {
  return adult ? "+18" : "+13";
}
