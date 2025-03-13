import React from "react";
import { Img } from "remotion";

const image: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: "100%",
  maxHeight: "100%",
  minWidth: "100%",
  minHeight: "100%",
  objectFit: "contain",
};

export const Image: React.FC<{
  readonly src: string;
}> = ({ src }) => {
  return <Img src={src} style={image} />;
};
