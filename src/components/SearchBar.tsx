"use client";

import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { searchMovies } from "@/lib/tmdb";
import { Movie } from "@/types/movie";
import Image from "next/image";

interface SearchBarProps {
  onSearchResults?: (results: Movie[]) => void;
  onSearchToggle?: (isSearching: boolean) => void;
}

export default function SearchBar({
  onSearchResults,
  onSearchToggle,
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const id = setTimeout(async () => {
      if (searchQuery.trim()) {
        setIsSearching(true);
        onSearchToggle?.(true);
        try {
          const results = await searchMovies(searchQuery);
          setSearchResults(results);
          onSearchResults?.(results);
        } catch {
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        onSearchResults?.([]);
        onSearchToggle?.(false);
      }
    }, 300);
    return () => clearTimeout(id);
  }, [searchQuery, onSearchResults, onSearchToggle]);

  const handleClear = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
    onSearchResults?.([]);
    onSearchToggle?.(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          className="w-full pl-10 pr-12 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>

      {showResults && searchQuery && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg border border-gray-700 max-h-96 overflow-y-auto z-50">
          {isSearching ? (
            <div className="p-4 text-center text-gray-400">Searching...</div>
          ) : searchResults.length > 0 ? (
            <div className="p-2">
              {searchResults.slice(0, 5).map((movie) => (
                <div
                  key={movie.id}
                  className="p-2 hover:bg-gray-700 rounded cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <Image
                      src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                      alt={movie.title}
                      width={92}
                      height={138}
                      className="w-12 h-16 object-cover rounded"
                      unoptimized
                    />
                    <div className="flex-1">
                      <h3 className="text-white font-medium text-sm">
                        {movie.title}
                      </h3>
                      <p className="text-gray-400 text-xs">
                        {movie.release_date?.split("-")[0]}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-400">No movies found</div>
          )}
        </div>
      )}
    </div>
  );
}
