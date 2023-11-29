import React from "react";
import { iconType } from "../../../utils/types";

type Props = {
  className?: string;
  iconName: iconType;
  strokeWidth?: number;
};
export default function Icon({ className, iconName, strokeWidth }: Props) {
  return (
    <>
      {React.createElement(iconName, {
        className,
        strokeWidth: strokeWidth,
      })}
    </>
  );
}
