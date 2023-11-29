import { Typography } from "@material-tailwind/react";
import React from "react";

type Props = {
  className?: string;
  message: string;
  styles?: React.CSSProperties;
};

export default function FullScreenMessage({
  className,
  message,
  styles,
}: Props) {
  return (
    <div className="h-screen flex justify-center items-center ">
      <Typography
        as="h3"
        className={` text-blue-gray-800 text-2xl font-bold  ${className}`}
      >
        {message}
      </Typography>
    </div>
  );
}
