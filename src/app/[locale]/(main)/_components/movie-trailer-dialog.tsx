"use client";

import { Play } from "lucide-react";
import { DialogTrigger, Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
        className="gap-2 px-6 py-6 text-base font-semibold rounded-md border-none transition-colors drop-shadow-md"
        aria-label={buttonText}
      >
        <Play className="w-5 h-5 fill-current" aria-hidden="true" />
        {buttonText.toUpperCase()}
      </Button>
      <Dialog
        className="sm:max-w-5xl w-full p-0 border-none bg-black overflow-hidden aspect-video shadow-2xl"
        showCloseButton={true}
      >
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
          title={`${title} Trailer`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </Dialog>
    </DialogTrigger>
  );
}
