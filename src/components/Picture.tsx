import React, { useMemo, useState, useCallback } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import FastImage, { Source } from "react-native-fast-image";
import { AspectRatio, useAspectRatio } from "../hooks/use-aspect-ratio";
import { useLinkProps } from "@react-navigation/native";
import { useIsInView } from "../hooks/use-is-in-view";
import { useTransaction } from "../api/useTransaction";
import { useTheme } from "../application/providers/Theming";

type ResizeMode = "cover" | "contain" | "stretch" | "center";
type MediaOrientation = "portrait" | "landscape";

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

interface DefaultProps
  extends Required<
    Pick<Props, "resizeMode" | "aspectRatio" | "orientation" | "lazyload">
  > {}

const defaultProps: DefaultProps = {
  resizeMode: "cover",
  aspectRatio: "standard",
  orientation: "landscape",
  lazyload: true,
};

const Picture = React.memo(function Picture(props: Props) {
  const {
    width,
    height,
    aspectRatio,
    orientation,
    source,
    resizeMode,
    lazyload,
    onImageLoaded,
    onImageFailed,
    children,
    style: overrideStyle,
  } = { ...defaultProps, ...props };

  const theme = useTheme();
  const [isImageAlreadyLoaded, setImageAlreadyLoaded] = useState(false);
  const [ref, isVisible] = useIsInView<View>({
    triggerOnce: true,
    delay: lazyload && !isImageAlreadyLoaded ? 1000 : undefined,
    mode: "partially-visible",
    screenExtraMargin: 10,
  });

  const aspectRatioValue = useAspectRatio(aspectRatio);

  const sanitizedWidth = useMemo(() => {
    if (height && !width) {
      if (typeof height == "number") {
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

  const styles: ViewStyle = {
    position: "relative",
    width: sanitizedWidth,
    height,
    backgroundColor: theme.colors.backgroundAccent,
    aspectRatio:
      orientation === "portrait" ? 1 / aspectRatioValue : aspectRatioValue,
    ...overrideStyle,
  };

  const shouldRenderImage =
    !lazyload || isImageAlreadyLoaded || (lazyload && isVisible);

  return (
    <View ref={ref} style={styles}>
      {shouldRenderImage && (
        <FastImage
          source={
            typeof source === "string"
              ? {
                  uri: source,
                  priority: FastImage.priority.high,
                  cache: "cacheOnly",
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
