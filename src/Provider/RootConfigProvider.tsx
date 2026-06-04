import ReduxProvider from "./ReduxProvider";
import { AppStateProvider } from "./StateProvider";
import { PropsWithChildren } from "react";
import { Toaster } from "react-hot-toast";

export function RootConfigProvider({ children }: PropsWithChildren) {
  return (
    <ReduxProvider>
      <AppStateProvider>
        {children}
        <Toaster />
      </AppStateProvider>
    </ReduxProvider>
  );
}
