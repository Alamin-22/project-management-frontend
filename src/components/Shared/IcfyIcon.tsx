"use client";

import { Icon, IconProps } from "@iconify/react";
import { CSSProperties } from "react";

interface IcfyIconProps extends Omit<IconProps, "style"> {
  icon: string;
  style?: CSSProperties;
  className?: string;
}

const IcfyIcon = ({
  icon,
  style = {},
  className = "",
  ...props
}: IcfyIconProps) => {
  const styles: CSSProperties = { display: "inline-block", ...style };

  return <Icon icon={icon} style={styles} className={className} {...props} />;
};

export default IcfyIcon;
