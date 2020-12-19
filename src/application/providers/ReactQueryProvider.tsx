import React from "react";
import { QueryClientProvider, QueryClient } from "react-query";

const client = new QueryClient();

const ReactQueryProvider: React.FunctionComponent = ({ children }) => {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

export { ReactQueryProvider };
