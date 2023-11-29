import React from "react";

type Props = {
  className?: string;
  children: React.ReactNode;
  styles?: React.CSSProperties;
};

export default function Heading1({ className, children, styles }: Props) {
  return (
    <h1 className={`${className} text-3xl font-bold capitalize`}>{children}</h1>
  );
}
