import { useCallback, useState } from "react";
import CameraRoll from "@react-native-community/cameraroll";
import { useQuery } from "react-query";
import { QueryIds } from "./QueryIds";

function getCamerarollPhotos({ page }: { page: number }) {
  return CameraRoll.getPhotos({
    first: (page + 1) * 100,
    assetType: "Photos",
  });
}

function usePhotoGallery() {
  const [page, setPage] = useState(0);
  const next = useCallback(() => {
    setPage((p) => p + 1);
  }, []);

  const result = useQuery(
    [QueryIds.getUserPhotos, page],
    () => getCamerarollPhotos({ page }),
    { keepPreviousData: true, staleTime: 5000 }
  );

  return {
    ...result,
    next,
  };
}

export { usePhotoGallery };
