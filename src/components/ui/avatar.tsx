"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

function Avatar({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & {
  size?: "default" | "sm" | "lg";
}) {
  return (
    <div
      data-slot="avatar"
      data-size={size}
      className={cn(
        "group/avatar relative flex size-8 shrink-0 select-none rounded-full after:absolute after:inset-0 after:rounded-full after:border after:border-border after:mix-blend-darken data-[size=lg]:size-10 data-[size=sm]:size-6 dark:after:mix-blend-lighten",
        className,
      )}
      {...props}
    />
  );
}

type ImageState = "loading" | "loaded" | "error";

function AvatarImage({ className, ...props }: React.ComponentProps<"img">) {
  const [state, setState] = React.useState<ImageState>(
    props.src ? "loading" : "error",
  );
  return (
    <img
      data-slot="avatar-image"
      alt={props.alt || ""}
      data-state={state}
      onLoad={() => setState("loaded")}
      onError={() => setState("error")}
      className={cn(
        "peer aspect-square size-full rounded-full object-cover data-[state=error]:hidden",
        className,
      )}
      {...props}
    />
  );
}

function AvatarFallback({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-muted text-muted-foreground text-sm peer-[*]:hidden group-data-[size=sm]/avatar:text-xs peer-data-[state=error]:flex",
        className,
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };
