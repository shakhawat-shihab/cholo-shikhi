import React, { Children } from "react";

type Props = {
  className?: string;
  htmlFor?: string;
  children: React.ReactNode;
};

export default function Label({ htmlFor, className, children }: Props) {
  return (
    <label htmlFor={htmlFor} className={className}>
      {children}
    </label>
  );
}
