"use client";
import store from "@/Redux/store";
import { Provider } from "react-redux";

export interface LayoutProps {
  children: React.ReactNode;
}

const ReduxProvider = ({ children }: LayoutProps) => {
  return (
    <div>
      <Provider store={store}>{children}</Provider>
    </div>
  );
};

export default ReduxProvider;
