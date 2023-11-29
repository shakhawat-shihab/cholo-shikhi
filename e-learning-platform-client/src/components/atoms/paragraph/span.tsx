import React from "react";

type Props = {
  className?: string;
  children: React.ReactNode;
  styles?: React.CSSProperties;
};

export default function Span({ className, children, styles }: Props) {
  return (
    <span className={`${className} text-sm inline-block`}>{children}</span>
  );
}
