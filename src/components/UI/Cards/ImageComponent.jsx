"use client";

import Image from "next/image";
import { useState } from "react";

const ImageComponent = ({
  src = "/assets/images/defaultImage.png",
  alt = "default image",
  width = 300,
  height = 300,
  fill = false,
  className = "img-fluid",
  priority = false,
  ...props
}) => {
  const [error, setError] = useState(false);

  return (
    <Image
      style={{ borderRadius: "8px", objectFit: "cover" }}
      src={error ? "/assets/images/defaultImage.png" : src}
      alt={alt}
      quality={75}
      {...(fill ? { fill: true } : { width, height })}
      className={` ${className}`}
      onError={() => setError(true)}
      priority={priority}
      loading={priority ? "eager" : "lazy"}
      {...props}
    />
  );
};

export default ImageComponent;
