import React, {
  RefObject,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { Dimensions, NativeMethodsMixin } from "react-native";
import { useInterval } from "./use-interval";

interface Options {
  /**
   * Delay in milliseconds between checks
   *
   * _defaults to **100** ms_
   */
  delay?: number;

  /**
   * Mode of checking for visibility
   *
   * **completely-visible** - checks if the view is completely visible on Screen
   * **partially-visible** - checks if at least a single pixel of the view is visible on Screen
   *
   * _defaults to **completely-visible**_
   */
  mode?: "completely-visible" | "partially-visible";

  /**
   * Extra margin to consider a view inView - to be in whole percentage (ie. 20 == 20% extra margin).
   *
   * _defaults to **0** %_
   */
  screenExtraMargin?: number;

  /**
   * Trigger isVisible only once, stops observing as soon as isVisible is true
   *
   * _defaults to **false**_
   */
  triggerOnce?: boolean;
}

type InViewHookResponse<T> = [RefObject<T>, boolean];

const defaultOptions: Required<Options> = {
  delay: 100,
  mode: "completely-visible",
  screenExtraMargin: 0,
  triggerOnce: false,
};

/**
 * Hook which allows to observe a given ref for its visibility on its current window.
 *
 * It loops over the configured interval to check if the current position of the given
 * view is within the bounds of the window.
 *
 * It can be controlled as well by the context `InViewContext` - which a parent component
 * on the render tree can define that its whole subtree should always be inactive.
 *
 * @param options Options to configure how often it updates and a few modes. Further
 * details described on the Options type itself.
 */
function useIsInView<T extends NativeMethodsMixin>(
  options: Options = defaultOptions
): InViewHookResponse<T> {
  const { delay, mode, screenExtraMargin, triggerOnce } = {
    ...defaultOptions,
    ...options,
  };

  const { isViewActive } = useContext<InViewContextInterface>(InViewContext);
  const [isVisible, setVisible] = useState<boolean>(false);

  const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

  const screenMeasure = useMemo<Measure>(() => {
    const extraMarginRatio = 1 + screenExtraMargin / 100;
    const screenWidth = windowWidth * extraMarginRatio;
    const screenHeight = windowHeight * extraMarginRatio;
    const extraHorizontalMargin = screenWidth / windowWidth / 2;
    const extraVerticalMargin = screenHeight / windowHeight / 2;

    return {
      left: -extraHorizontalMargin,
      top: -extraVerticalMargin,
      right: screenWidth + extraHorizontalMargin,
      bottom: screenHeight + extraVerticalMargin,
    };
  }, [screenExtraMargin, windowWidth, windowHeight]);

  const ref = useRef<T>(null);

  const observer = useCallback(() => {
    if (!ref.current || !isViewActive) {
      return;
    }

    ref.current.measureInWindow((x, y, width, height) => {
      const component: Measure = {
        left: x,
        top: y,
        right: x + width,
        bottom: y + height,
      };

      const visible =
        mode === "completely-visible"
          ? isFullyVisible(component, screenMeasure)
          : isPartiallyVisible(component, screenMeasure);
      setVisible(visible);
    });
  }, [isViewActive, setVisible, mode, screenMeasure]);

  useInterval(
    observer,
    (triggerOnce && isVisible) || !isViewActive ? undefined : delay
  );

  return [ref, isVisible];
}

type Measure = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

function isFullyVisible(
  componentMeasure: Measure,
  screenMeasure: Measure
): boolean {
  const { left, top, right, bottom } = componentMeasure;
  const {
    left: screenLeft,
    top: screenTop,
    right: screenRight,
    bottom: screenBottom,
  } = screenMeasure;

  const isWiderThanScreen = right - left > screenRight - screenLeft;
  const isTallerThanScreen = bottom - top > screenBottom - screenTop;

  const xAxisVisible = isWiderThanScreen
    ? left < screenLeft && right > screenRight
    : left >= screenLeft && right <= screenRight;
  const yAxisVisible = isTallerThanScreen
    ? top < screenTop && bottom > screenBottom
    : top >= screenTop && bottom <= screenBottom;

  return xAxisVisible && yAxisVisible;
}

function isPartiallyVisible(
  componentMeasure: Measure,
  screenMeasure: Measure
): boolean {
  const { left, top, right, bottom } = componentMeasure;
  const {
    left: screenLeft,
    top: screenTop,
    right: screenRight,
    bottom: screenBottom,
  } = screenMeasure;

  const xAxisPartialVisible =
    (left >= screenLeft && left <= screenRight) ||
    (right >= screenLeft && right <= screenRight);
  const yAxisPartialVisible =
    (top >= screenTop && top <= screenBottom) ||
    (bottom >= screenTop && bottom <= screenBottom);

  return xAxisPartialVisible && yAxisPartialVisible;
}

interface InViewContextInterface {
  isViewActive: boolean;
}

const options: InViewContextInterface = {
  isViewActive: true,
};

/**
 * Context which allows a parent container to specify that this view tree
 * is not active.
 *
 * Examples of use cases:
 * - Navigation hierarchy - a screen might be mounted, but its components
 * are not active on the three.
 * - Modal presentation - screen that is on the background might consider
 * not being active.
 */
const InViewContext = React.createContext(options);

export { useIsInView, InViewContext };
