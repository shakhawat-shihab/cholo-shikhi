import React from "react";

type Props = {
  src: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
};

export default function Img({ src, alt, className, style }: Props) {
  //   console.log(alt);
  return <img src={src} className={className} style={style} alt={alt} />;
}
