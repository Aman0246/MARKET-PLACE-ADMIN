import React, { useState } from "react";
import classNames from "classnames";

const Image = ({
  src,
  alt = "Image",
  width,
  height,
  className = "",
  fallback = '/Profileimage.png',
  rounded = false,
  shadow = false,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  const handleError = (e) => {
    if (!hasError) {
      setHasError(true);
      e.target.src = fallback;
    }
  };

  return (
    <img
      src={hasError ? fallback : src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      onError={handleError}
      className={classNames(className, {
        "rounded-xl": rounded,
        "shadow-md": shadow,
      })}
      {...props}
    />
  );
};

export default Image;
