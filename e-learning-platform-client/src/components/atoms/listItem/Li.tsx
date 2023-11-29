import React from "react";

type Props = { className?: string; children: React.ReactNode };

export default function Li({ className, children }: Props) {
  return <li className={className}>{children}</li>;
}
