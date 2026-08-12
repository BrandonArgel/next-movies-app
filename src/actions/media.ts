"use server";

import {
  getMediaAccountState,
  rateMedia,
  toggleFavorite,
  toggleWatchList,
  unrateMedia,
} from "@/lib/api/account";
import { requireUser } from "@/lib/auth-utils";
import type { MediaType } from "@/types/media";

export async function toggleFavoriteAction(
  mediaId: number,
  isFavorite: boolean,
  mediaType: MediaType,
) {
  try {
    const { user, token } = await requireUser();
    if (!user || !token) return { success: false, error: "Unauthorized" };

    return await toggleFavorite(user.id, token, mediaType, mediaId, isFavorite);
  } catch (_error) {
    return { success: false, error: "default" };
  }
}

export async function toggleWatchListAction(
  mediaId: number,
  isWatchList: boolean,
  mediaType: MediaType,
) {
  try {
    const { user, token } = await requireUser();
    if (!user || !token) return { success: false, error: "Unauthorized" };

    return await toggleWatchList(
      user.id,
      token,
      mediaType,
      mediaId,
      isWatchList,
    );
  } catch (_error) {
    return { success: false, error: "default" };
  }
}

export async function getMediaAccountStateAction(
  mediaId: number,
  mediaType: MediaType,
) {
  try {
    const { user, token } = await requireUser();
    if (!user || !token) return { success: false, error: "Unauthorized" };

    const res = await getMediaAccountState(mediaType, mediaId, token);

    if (!res.success) return { success: false, error: res.error };
    return { success: true, data: res.data };
  } catch (_error) {
    return { success: false, error: "Unexpected error" };
  }
}

export async function rateMediaAction(
  mediaId: number,
  ratingFromUi: number,
  mediaType: MediaType,
) {
  try {
    const { user, token } = await requireUser();
    if (!user || !token) return { success: false, error: "Unauthorized" };

    return await rateMedia(mediaType, mediaId, token, ratingFromUi);
  } catch (_error) {
    return { success: false, error: "default" };
  }
}

export async function unrateMediaAction(mediaId: number, mediaType: MediaType) {
  try {
    const { user, token } = await requireUser();
    if (!user || !token) return { success: false, error: "Unauthorized" };

    return await unrateMedia(mediaType, mediaId, token);
  } catch (_error) {
    return { success: false, error: "default" };
  }
}
