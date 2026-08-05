import { ImageWithSkeleton } from "@/components/ui/image-with-skeleton";
import { Star } from "lucide-react";
import { Review } from "@/types/movies";

export function ReviewCard({ review }: { review: Review }) {
  const { author, author_details, content } = review;
  const avatarPath = author_details?.avatar_path;

  return (
    <div className="bg-muted/30 p-6 rounded-2xl border border-border flex flex-col gap-4">
      <div className="flex items-center gap-3">
        {avatarPath ? (
          <ImageWithSkeleton
            src={
              avatarPath.startsWith("/https")
                ? avatarPath.substring(1)
                : `https://image.tmdb.org/t/p/w150_and_h150_face${avatarPath}`
            }
            alt={author}
            width={40}
            height={40}
            containerClassName="w-10 h-10 rounded-full shrink-0"
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 shrink-0 bg-primary/20 rounded-full flex items-center justify-center font-bold text-primary">
            {author.charAt(0).toUpperCase()}
          </div>
        )}

        <div>
          <h3 className="font-semibold leading-tight">{author}</h3>
          {author_details?.rating && (
            <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
              <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
              <span>{author_details.rating}/10</span>
            </div>
          )}
        </div>
      </div>

      <p className="text-sm text-muted-foreground line-clamp-4">{content}</p>
    </div>
  );
}
