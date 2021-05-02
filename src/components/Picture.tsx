import React, { useCallback, useMemo, useState } from "react";
import { View, ViewStyle } from "react-native";
import FastImage, { Source } from "react-native-fast-image";
import { useTheme } from "../providers/Theming/hooks/use-theme";

type ResizeMode = "cover" | "contain" | "stretch" | "center";
type MediaOrientation = "portrait" | "landscape";
type AspectRatio =
  | "standard"
  | "classic"
  | "square"
  | "widescreen"
  | "panorama"
  | "superscope";

interface Props {
  /** Image Url or React Native image source object */
  source: Source | string;

  /** Changes how the image will fit in its container. Default: "cover" */
  resizeMode?: ResizeMode;

  /** Calculates the height of the container give its width. Default: "standard" */
  aspectRatio?: AspectRatio;

  /** Determines whether the aspect ratio will be landscape (e.g.: 3:4) or portrait (e.g. 4:3). Default: "landscape" */
  orientation?: MediaOrientation;

  /** image width can be number or '100%' string */
  width?: number | string;

  /** image height can be number or '100%' string */
  height?: number | string;

  /** Enables image lazyload. Default: "true" */
  lazyload?: boolean;

  /** Called when error happens during image loading */
  onImageFailed?: () => void;

  /** Called when image loaded successfully */
  onImageLoaded?: () => void;

  /** Optional Children to render over Picture */
  children?: React.ReactNode;

  /** Optional extra styles */
  style?: ViewStyle;
}

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

const Picture = React.memo(function Picture(props: Props) {
  const {
    width,
    height,
    source,
    onImageLoaded,
    onImageFailed,
    children,
    resizeMode = "cover",
    aspectRatio = "standard",
    orientation = "landscape",
    lazyload = true,
    style: overrideStyle,
  } = props;

  const theme = useTheme();
  const [isImageAlreadyLoaded, setImageAlreadyLoaded] = useState(false);
  const aspectRatioValue = useMemo(() => getAspectRatioValue(aspectRatio), [
    aspectRatio,
  ]);

  const sanitizedWidth = useMemo(() => {
    if (height && !width) {
      if (typeof height === "number") {
        // we inverse portrait here to preserve expected layout behavior as we calculate width based on height
        const value =
          orientation === "portrait" ? aspectRatioValue : 1 / aspectRatioValue;
        return Math.floor(height / value);
      }
    }

    return width || "100%";
  }, [height, width, aspectRatioValue, orientation]);

  const onLoad = useCallback(() => {
    setImageAlreadyLoaded(true);

    if (onImageLoaded) {
      onImageLoaded();
    }
  }, [onImageLoaded, setImageAlreadyLoaded]);

  const styles: Object = {
    position: "relative",
    width: sanitizedWidth,
    height,
    backgroundColor: theme.colors.backgroundAccent,
    aspectRatio:
      orientation === "portrait" ? 1 / aspectRatioValue : aspectRatioValue,
    ...overrideStyle,
  };

  const shouldRenderImage = !lazyload || isImageAlreadyLoaded || lazyload;

  return (
    <View style={styles}>
      {shouldRenderImage && (
        <FastImage
          source={
            typeof source === "string"
              ? {
                  uri: source,
                  priority: FastImage.priority.high,
                }
              : source
          }
          style={{ ...styles, position: "absolute" }}
          resizeMode={resizeMode}
          onLoad={onLoad}
          onError={onImageFailed}
        />
      )}
      {children && <View style={{ flex: 1 }}>{children}</View>}
    </View>
  );
});

export { Picture };
