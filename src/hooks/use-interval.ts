import { useEffect, useRef } from "react";

/**
 * Declarative approach with a hook which encapsulates `setInterval`.
 *
 * Based on Dan Abramov post:
 *   https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 *
 * @param callback Callback to be executed every `delay` milliseconds.
 * @param delay Delay of execution. Setting `undefined` stops the interval calls.
 */
function useInterval(callback: () => void, delay?: number) {
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    let mounted = true;

    function tick() {
      const callback = savedCallback.current;
      if (mounted && callback) {
        callback();
      }
    }

    const id = delay ? setInterval(tick, delay) : undefined;
    return () => {
      mounted = false;
      id && clearInterval(id);
    };
  }, [delay]);
}

export { useInterval };
