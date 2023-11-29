import { Spinner } from "@material-tailwind/react";
import React from "react";

type Props = {
  className?: string;
  styles?: React.CSSProperties;
};

export default function CustommSpinner({ className, styles }: Props) {
  return <Spinner className={`${className}`}> </Spinner>;
}
