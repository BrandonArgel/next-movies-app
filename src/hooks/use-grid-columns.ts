"use client";

import { useState, useEffect } from "react";

export function useGridColumns(): number {
  const [columns, setColumns] = useState<number>(2);

  useEffect(() => {
    const getColumns = (): number => {
      const width = window.innerWidth;
      if (width >= 1024) return 5;
      if (width >= 768) return 4;
      if (width >= 640) return 3;
      return 2;
    };

    setColumns(getColumns());

    let frameId: number;

    const handleResize = (): void => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        setColumns(getColumns());
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return columns;
}
