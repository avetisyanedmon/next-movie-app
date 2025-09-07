"use client";

import { useState, useEffect } from "react";
import { Menu, ChevronRight } from "lucide-react";
import { Movie } from "@/types/movie";
import { fetchPopularMovies, fetchRecommendedMovies } from "@/lib/tmdb";
import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";

export default function Home() {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [popular, recommended] = await Promise.all([
          fetchPopularMovies(),
          fetchRecommendedMovies(550),
        ]);
        setPopularMovies(popular);
        setRecommendedMovies(recommended);
      } catch {
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <header className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-lg font-semibold">U</span>
            </div>
            <div>
              <p className="text-sm text-gray-300">Welcome back</p>
              <p className="text-lg font-semibold">User</p>
            </div>
          </div>
          <Menu className="w-6 h-6 text-white" />
        </div>
        <SearchBar
          onSearchResults={setSearchResults}
          onSearchToggle={setIsSearching}
        />
      </header>

      {isSearching ? (
        <section className="px-4 mb-8 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-4">Search Results</h2>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4">
            {searchResults.map((m) => (
              <MovieCard key={m.id} movie={m} className="snap-start" />
            ))}
          </div>
        </section>
      ) : (
        <>
          <section className="px-4 mb-8 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Popular</h2>
              <div className="flex items-center text-yellow-400">
                <span className="text-sm mr-1">See all</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4">
              {popularMovies.map((m) => (
                <MovieCard key={m.id} movie={m} className="snap-start" />
              ))}
            </div>
          </section>
          <section className="px-4 mb-8 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Recommended</h2>
              <div className="flex items-center text-yellow-400">
                <span className="text-sm mr-1">See all</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4">
              {recommendedMovies.map((m) => (
                <MovieCard key={m.id} movie={m} className="snap-start" />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
