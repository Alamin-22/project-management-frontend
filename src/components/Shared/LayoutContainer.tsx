import React from "react";
import { cn } from "@/lib/utils";

export interface LayoutContainerProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  fullWidth?: boolean;
  as?: React.ElementType;
}

const LayoutContainer = ({
  children,
  className,
  fullWidth = false,
  as: Component = "div",
  ...rest
}: LayoutContainerProps) => {
  return (
    <Component
      className={cn(
        // Base classes applied to everything
        "w-full px-3 sm:px-4 lg:px-5 mx-auto my-10",

        // Conditional constraint
        !fullWidth && "max-w-350",

        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default LayoutContainer;
