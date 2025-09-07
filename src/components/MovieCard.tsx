"use client";

import { Movie } from "@/types/movie";
import { getImageUrl } from "@/lib/tmdb";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface MovieCardProps {
  movie: Movie;
  className?: string;
}

export default function MovieCard({ movie, className }: MovieCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/movie/${movie.id}`);
  };

  const fullStars = Math.round(movie.vote_average / 2);

  return (
    <div
      className={`flex-shrink-0 w-32 sm:w-36 cursor-pointer hover:scale-105 transition-transform ${className || ""}`}
      onClick={handleClick}
    >
      <div className="relative">
        <Image
          src={getImageUrl(movie.poster_path, "w300")}
          alt={movie.title}
          width={300}
          height={450}
          className="w-full h-48 sm:h-52 object-cover rounded-lg shadow-lg"
          sizes="(max-width: 640px) 144px, 200px"
          unoptimized
        />
      </div>
      <div className="mt-2">
        <h3 className="text-sm font-medium text-white truncate">{movie.title}</h3>
        <div className="flex items-center mt-1">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < fullStars ? "text-yellow-400 fill-yellow-400" : "text-gray-500"}`}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

