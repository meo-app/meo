import { useRef, useEffect } from "react";

function useWhyDidYouUpdate<T extends Record<string, unknown>>(
  name: string,
  props: T
) {
  const previousProps = useRef<T>();
  useEffect(() => {
    if (previousProps.current) {
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      const changesObj: Record<string, unknown> = {};
      allKeys.forEach((key) => {
        if (previousProps.current?.[key] !== props?.[key]) {
          changesObj[key] = {
            from: previousProps.current?.[key],
            to: props[key],
          };
        }
      });

      if (Object.keys(changesObj).length) {
        console.log("[why-did-you-update]", name, changesObj);
      }
    }

    previousProps.current = props;
  });
}

export { useWhyDidYouUpdate };
