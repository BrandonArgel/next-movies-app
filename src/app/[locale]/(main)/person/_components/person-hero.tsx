// app/[locale]/person/_components/person-hero.tsx
import Image from "next/image";
import { type PersonDetail } from "@/types/person";
import { Calendar, MapPin } from "lucide-react";

export function PersonHero({ person }: { person: PersonDetail }) {
  const { name, biography, profile_path, birthday, place_of_birth } = person;

  const birthYear = birthday ? new Date(birthday).getFullYear() : null;

  return (
    <section className="relative w-full bg-black/95 pt-32 pb-16 md:pt-40 md:pb-20 border-b border-white/10">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
        {/* Foto de Perfil */}
        <div className="relative w-64 h-96 md:w-80 md:h-120 shrink-0 rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/20">
          {profile_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/w500${profile_path}`}
              alt={name}
              fill
              priority
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-white/5 flex items-center justify-center">
              <span className="text-white/30 text-xl">Sin Foto</span>
            </div>
          )}
        </div>

        {/* Información del Actor */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4 flex-1">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            {name}
          </h1>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm md:text-base text-white/70 font-medium">
            {birthYear && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{birthYear}</span>
              </div>
            )}
            {place_of_birth && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                <span>{place_of_birth}</span>
              </div>
            )}
          </div>

          <div className="mt-4 text-white/80 text-base md:text-lg leading-relaxed max-w-3xl">
            {biography ? (
              <p className="line-clamp-6 md:line-clamp-none">{biography}</p>
            ) : (
              <p className="italic opacity-50">No hay biografía disponible.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
