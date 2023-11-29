import React from "react";
import Li from "../../atoms/listItem/Li";

type Props = { className?: string; children: React.ReactNode };

export default function IconedLi({ children }: Props) {
  return <Li>{children}</Li>;
}
