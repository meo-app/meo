import { useMemo } from "react";

/**
 * Describes the aspect ratio:
 *
 * - Standard: 4:3
 * - Classic: 3:2
 * - Square: 1:1
 * - Widescreen: 16:9
 * - Panorama: 3:1
 * - Superscope: 2:1
 * */
type AspectRatio =
  | "standard"
  | "classic"
  | "square"
  | "widescreen"
  | "panorama"
  | "superscope";

function getAspectRatioValue(aspectRatio?: AspectRatio): number {
  switch (aspectRatio) {
    case "classic":
      return 1.5; // 3/2;

    case "square":
      return 1; // 1/1

    case "widescreen":
      return 1.777; // 16/9;

    case "panorama":
      return 3; // 3/1;

    case "superscope":
      return 2; // 2/1;

    case "standard": // DEFAULT
    default:
      return 1.333; // 4/3;
  }
}

function useAspectRatio(aspectRatio: AspectRatio) {
  return useMemo(() => getAspectRatioValue(aspectRatio), [aspectRatio]);
}

export { getAspectRatioValue, useAspectRatio, AspectRatio };
