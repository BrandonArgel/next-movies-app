"use client";

import Image from "next/image";
import { Star, Play, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Movie } from "@/tyoes/movies";

interface MovieHeroProps {
  movie: Movie;
}

export default function MovieHero({ movie }: MovieHeroProps) {
  const { backdrop_path, overview, title, vote_average } = movie;

  return (
    <section className="relative w-full h-[80vh] min-h-150 flex items-center">
      {/* Imagen de fondo */}
      <Image
        src={`https://image.tmdb.org/t/p/original${backdrop_path}`}
        alt={title}
        fill
        priority
        className="object-cover absolute inset-0 z-0"
      />

      <div className="absolute inset-0 bg-linear-to-r from-black/95 via-black/60 to-transparent z-10" />
      <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent z-10" />

      <div className="relative z-20 container mx-auto px-4 md:px-8 flex flex-col items-start gap-5 max-w-3xl">
        <div className="flex items-center gap-3 text-sm md:text-base font-medium text-white/90">
          <div className="flex items-center gap-1.5 text-red-500">
            <Star className="w-5 h-5 fill-current" />
            <span className="text-white">{vote_average.toFixed(1)}</span>
          </div>

          <span className="text-white/50">•</span>

          <span>2h 25m</span>

          <span className="text-white/50">•</span>

          <span className="bg-[#E53935] text-white text-xs font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
            Trending
          </span>
        </div>

        {/* Título de la película */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight">
          {title}
        </h1>

        {/* Sinopsis (Overview) */}
        <p className="text-white/80 text-base md:text-lg lg:text-xl line-clamp-4 leading-relaxed max-w-2xl">
          {overview}
        </p>

        {/* Botones de acción */}
        <div className="flex items-center gap-4 mt-2">
          <Button className="bg-[#E53935] hover:bg-red-700 text-white gap-2 px-6 py-6 text-base font-semibold rounded-md border-none transition-colors">
            <Play className="w-5 h-5 fill-current" />
            PLAY TRAILER
          </Button>

          <Button
            variant="secondary"
            className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-md gap-2 px-6 py-6 text-base font-semibold rounded-md border-none transition-colors"
          >
            <Info className="w-5 h-5" />
            DETAILS
          </Button>
        </div>
      </div>
    </section>
  );
}
