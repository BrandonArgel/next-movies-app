"use client";

import {
  SliderFill,
  Slider as SliderPrimitive,
  type SliderProps as SliderPrimitiveProps,
  SliderThumb,
  SliderTrack,
} from "react-aria-components";

import { cn } from "@/lib/utils";

type SliderValue = number | number[];
type SliderProps<T extends SliderValue = SliderValue> = Omit<
  SliderPrimitiveProps<T>,
  "className"
> & {
  className?: string;
};

function Slider<T extends SliderValue = SliderValue>({
  className,
  ...props
}: SliderProps<T>) {
  return (
    <SliderPrimitive
      className={cn(
        "group relative flex w-full touch-none select-none items-center data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col data-disabled:opacity-50",
        className,
      )}
      data-slot="slider"
      {...props}
    >
      {({ state }) => {
        return (
          <>
            <SliderTrack
              data-slot="slider-track"
              className="relative grow select-none overflow-hidden rounded-full bg-muted data-horizontal:h-1 data-vertical:h-full data-horizontal:w-full data-vertical:w-1"
            >
              <SliderFill
                data-slot="slider-range"
                className="absolute select-none bg-primary data-horizontal:h-full data-vertical:w-full"
              />
            </SliderTrack>
            {state.values.map((_, index) => (
              <SliderThumb
                data-slot="slider-thumb"
                key={index}
                index={index}
                className="after:-inset-2 relative block size-3 shrink-0 select-none rounded-full border border-ring bg-white ring-ring/50 transition-[color,box-shadow] after:absolute hover:ring-3 focus-visible:outline-hidden focus-visible:ring-3 active:ring-3 disabled:pointer-events-none disabled:opacity-50 group-data-vertical:start-[50%] group-data-horizontal:top-[50%]"
              />
            ))}
          </>
        );
      }}
    </SliderPrimitive>
  );
}

export { Slider };
