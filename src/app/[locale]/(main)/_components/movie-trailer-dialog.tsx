"use client";

import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

interface TrailerDialogProps {
  trailerKey: string;
  title: string;
  buttonText: string;
}

export function MovieTrailerDialog({
  trailerKey,
  title,
  buttonText,
}: TrailerDialogProps) {
  return (
    <DialogTrigger>
      <Button
        className="gap-2 rounded-md border-none px-6 py-6 font-semibold text-base drop-shadow-md transition-colors"
        aria-label={buttonText}
      >
        <Play className="h-5 w-5 fill-current" aria-hidden="true" />
        {buttonText.toUpperCase()}
      </Button>
      <Dialog
        className="aspect-video w-full overflow-hidden border-none bg-black p-0 shadow-2xl sm:max-w-5xl"
        showCloseButton={true}
      >
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
          title={`${title} Trailer`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </Dialog>
    </DialogTrigger>
  );
}
