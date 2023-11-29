import React from "react";

type Props = {
  className?: string;
  children: React.ReactNode;
};

export default function Paragraph({ className = "", children }: Props) {
  return <p className={`${className} text-base`}>{children}</p>;
}
