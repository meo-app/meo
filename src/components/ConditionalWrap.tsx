import React from "react";

const ConditionalWrap: React.FunctionComponent<{
  condition: boolean;
  wrap: React.FunctionComponent<{}>;
}> = (
  { condition, children, wrap } = {
    condition: false,
    children: <React.Fragment />,
    wrap: () => null,
  }
) => <>{condition ? wrap({ children }) : children}</>;

export { ConditionalWrap };
