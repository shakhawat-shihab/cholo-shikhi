import React from "react";

type Props = {
  className?: string;
  children: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg";
  // handleClick: () => void;
  handleClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  // handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Button({
  className,
  children,
  size,
  handleClick,
}: Props) {
  return (
    <button
      className={`${className} custom-${size}-btn  `}
      onClick={(e) => handleClick(e)}
    >
      {" "}
      {children}{" "}
    </button>
  );
}
