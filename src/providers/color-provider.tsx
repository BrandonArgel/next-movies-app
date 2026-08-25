"use client";

import type React from "react";
import { createContext, useCallback, useContext, useState } from "react";
import { ACCENT_COLORS_VALUES, type AccentColor } from "@/lib/colors";

interface ColorContextType {
  color: AccentColor;
  setColor: (color: AccentColor) => void;
}

const ColorContext = createContext<ColorContextType | undefined>(undefined);

export function ColorProvider({
  children,
  initialColor,
}: {
  children: React.ReactNode;
  initialColor: AccentColor;
}) {
  const [color, setColorState] = useState<AccentColor>(initialColor);

  const setColor = useCallback((next: AccentColor) => {
    setColorState(next);
    document.cookie = `app-color=${next}; path=/; max-age=31536000`;
    document.documentElement.setAttribute("data-color", next);

    const rawColor = ACCENT_COLORS_VALUES[next];
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.type = "image/svg+xml";
    link.href = `/api/favicon?color=${encodeURIComponent(rawColor)}`;
  }, []);

  return (
    <ColorContext.Provider value={{ color, setColor }}>
      {children}
    </ColorContext.Provider>
  );
}

export function useColor(): ColorContextType {
  const context = useContext(ColorContext);
  if (!context) {
    throw new Error(
      "useColor must be used within a ColorProvider. " +
        "Make sure ColorProvider is rendered inside AppProvider.",
    );
  }
  return context;
}
