"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Toaster as SileoToaster } from "sileo";

type ToasterTheme = "light" | "dark";

export function ToastProvider() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const invertedTheme: ToasterTheme =
    resolvedTheme === "light" ? "dark" : "light";

  return (
    <SileoToaster theme={invertedTheme} position="bottom-right" offset={0} />
  );
}
