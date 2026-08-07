import { fetchTMDB } from "../fetch-tmdb";
import type { TMDBResponse } from "@/types/api";
import { Collection } from "@/types/collection";

export const getCollection = (
  collectionId: string | number,
): TMDBResponse<Collection> => fetchTMDB(`/collection/${collectionId}`);
