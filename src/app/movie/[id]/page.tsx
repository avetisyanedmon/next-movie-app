"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Share, Play, Heart, Star } from "lucide-react";
import { MovieDetails, Cast } from "@/types/movie";
import {
  fetchMovieDetails,
  fetchMovieCredits,
  getImageUrl,
  formatRuntime,
  getAgeRestriction,
} from "@/lib/tmdb";
import { useFavorites } from "@/contexts/FavoritesContext";
import Image from "next/image";

export default function MovieDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [credits, setCredits] = useState<Cast[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const [posterSrc, setPosterSrc] = useState<string>("");

  useEffect(() => {
    async function loadMovieDetails() {
      try {
        const movieId = Number(params.id);
        if (!movieId) return;
        const [movieData, creditsData] = await Promise.all([
          fetchMovieDetails(movieId),
          fetchMovieCredits(movieId),
        ]);
        setMovie(movieData);
        setCredits(creditsData.cast.slice(0, 10));
      } catch (err) {
        console.error("Failed to load movie details:", err);
      } finally {
        setLoading(false);
      }
    }

    loadMovieDetails();
  }, [params.id]);

  useEffect(() => {
    if (!movie) return;
    const preferred =
      movie.poster_path || movie.backdrop_path
        ? getImageUrl(movie.poster_path ?? movie.backdrop_path, "w780")
        : "/placeholder-movie.jpg";
    setPosterSrc(preferred);
  }, [movie]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <p className="text-white text-lg animate-pulse">Loading...</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <p className="text-white text-lg">Movie not found</p>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    const fullStars = Math.round(rating / 2);
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        aria-hidden="true"
        className={`w-4 h-4 ${
          i < fullStars ? "text-yellow-400 fill-yellow-400" : "text-gray-500"
        }`}
      />
    ));
  };

  const handleIMDbClick = () => {
    if (movie.imdb_id) {
      window.open(`https://www.imdb.com/title/${movie.imdb_id}`, "_blank");
    }
  };

  return (
    <main className="min-h-screen bg-[#121212] text-white">
      {/* Hero Poster */}
      <section
        aria-label="Movie Poster"
        className="relative w-full h-[300px] sm:h-[380px] overflow-hidden rounded-b-2xl bg-black"
      >
        <Image
          src={posterSrc}
          alt={`${movie.title} poster`}
          fill
          className="object-cover rounded-b-2xl"
          priority
          sizes="100vw"
          onError={() => setPosterSrc("/placeholder-movie.jpg")}
        />

        {/* Overlay */}
        <div className="absolute inset-0 z-10 bg-black/40" />
        <div className="absolute bottom-0 inset-x-0 h-24 z-10 bg-gradient-to-t from-[#121212] to-transparent" />

        {/* Controls */}
        <div className="absolute inset-0 z-20 flex flex-col justify-between">
          <div className="flex justify-between p-4">
            <button
              aria-label="Go back"
              onClick={() => router.back()}
              className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <button
              aria-label="Share movie"
              className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <Share className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="flex justify-center pb-16">
            <button
              aria-label="Play trailer"
              className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center hover:bg-red-700 transition-colors"
            >
              <Play className="w-8 h-8 text-white ml-1" />
            </button>
          </div>

          <span className="self-end mb-4 mr-4 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
            {formatRuntime(movie.runtime)}
          </span>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 py-6 sm:px-6 lg:px-8">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-gray-700 px-3 py-1 rounded-full text-sm">
            {getAgeRestriction(movie.adult)}
          </span>
          {movie.genres.slice(0, 2).map((genre) => (
            <span
              key={genre.id}
              className="bg-gray-700 px-3 py-1 rounded-full text-sm"
            >
              {genre.name}
            </span>
          ))}
          <div className="flex items-center bg-gray-700 px-3 py-1 rounded-full text-sm">
            {renderStars(movie.vote_average)}
            <span className="ml-1">{movie.vote_average.toFixed(1)}</span>
          </div>
        </div>

        {/* Title + Favorite */}
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold">{movie.title}</h1>
          <button
            aria-label="Toggle favorite"
            onClick={() => toggleFavorite(movie)}
            className={`p-2 rounded-full transition-colors ${
              isFavorite(movie.id)
                ? "bg-red-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            <Heart
              className={`w-6 h-6 ${
                isFavorite(movie.id) ? "fill-current" : ""
              }`}
            />
          </button>
        </div>

        {/* Overview */}
        <div className="mb-6">
          <p className="text-gray-300 leading-relaxed">
            {showFullDescription
              ? movie.overview
              : `${movie.overview.slice(0, 150)}...`}
          </p>
          {movie.overview.length > 150 && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-red-500 text-sm mt-2 hover:underline"
            >
              {showFullDescription ? "Show Less" : "Show More"}
            </button>
          )}
        </div>

        {/* Actors */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Actors</h2>
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
            {credits.map((actor) => (
              <div key={actor.id} className="flex-shrink-0 text-center">
                <div className="w-16 h-16 rounded-full overflow-hidden mb-2 mx-auto">
                  <Image
                    src={getImageUrl(actor.profile_path, "w200")}
                    alt={actor.name}
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                </div>
                <p className="text-sm text-gray-300 truncate w-16">
                  {actor.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* IMDb Button */}
        <button
          onClick={handleIMDbClick}
          disabled={!movie.imdb_id}
          className="w-full bg-yellow-500 disabled:bg-gray-600 disabled:text-gray-300 text-black font-bold py-4 rounded-lg hover:bg-yellow-400 transition-colors"
        >
          Open IMDb
        </button>
      </section>
    </main>
  );
}
