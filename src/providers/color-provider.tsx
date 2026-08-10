"use client";

import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";

export type AccentColor =
  | "green"
  | "cyan"
  | "blue"
  | "indigo"
  | "purple"
  | "yellow"
  | "orange"
  | "red"
  | "pink"
  | "gray";

export interface ColorConfig {
  key: AccentColor;
  label: string;
  previewClass: string;
}

export const ACCENT_COLORS: ColorConfig[] = [
  {
    key: "blue",
    label: "Blue",
    previewClass: "bg-[oklch(0.488_0.243_264.376)]",
  },
  {
    key: "green",
    label: "Green",
    previewClass: "bg-[oklch(0.627_0.171_149.214)]",
  },
  {
    key: "cyan",
    label: "Cyan",
    previewClass: "bg-[oklch(0.705_0.133_214.346)]",
  },
  {
    key: "indigo",
    label: "Indigo",
    previewClass: "bg-[oklch(0.511_0.262_276.966)]",
  },
  {
    key: "purple",
    label: "Purple",
    previewClass: "bg-[oklch(0.558_0.288_292.717)]",
  },
  {
    key: "yellow",
    label: "Yellow",
    previewClass: "bg-[oklch(0.795_0.184_89.777)]",
  },
  {
    key: "orange",
    label: "Orange",
    previewClass: "bg-[oklch(0.646_0.222_41.116)]",
  },
  { key: "red", label: "Red", previewClass: "bg-[oklch(0.637_0.237_25.331)]" },
  {
    key: "pink",
    label: "Pink",
    previewClass: "bg-[oklch(0.645_0.246_346.816)]",
  },
  {
    key: "gray",
    label: "Gray",
    previewClass: "bg-[oklch(0.5971_0_0)]",
  },
];

interface ColorContextType {
  color: AccentColor;
  setColor: (color: AccentColor) => void;
}

const ColorContext = createContext<ColorContextType | undefined>(undefined);
const STORAGE_KEY = "app-color";

export function ColorProvider({ children }: { children: React.ReactNode }) {
  const [color, setColorState] = useLocalStorage<AccentColor>(
    STORAGE_KEY,
    ACCENT_COLORS[0].key,
    {
      serializer: (value) => value,
      deserializer: (value) => value as AccentColor,
    },
  );

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const html = document.documentElement;
    html.setAttribute("data-color", color);
  }, [color, mounted]);

  const setColor = useCallback(
    (next: AccentColor) => {
      setColorState(next);
    },
    [setColorState],
  );

  if (!mounted) {
    return (
      <ColorContext.Provider value={{ color: ACCENT_COLORS[0].key, setColor }}>
        {children}
      </ColorContext.Provider>
    );
  }

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
        "Make sure ColorToggle is rendered inside AppProvider.",
    );
  }
  return context;
}
