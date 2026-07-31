"use client";

import { useAppLocale } from "@/providers/locale-provider";
import { ArrowRight, ArrowLeft } from "lucide-react";

export function MiComponente() {
  const { locale, direction } = useAppLocale();

  return (
    <div>
      <p>El idioma actual es: {locale}</p>

      {/* Ejemplo: Cambiar la dirección de un ícono según la lectura */}
      <button>
        Continuar {direction === "ltr" ? <ArrowRight /> : <ArrowLeft />}
      </button>
    </div>
  );
}
