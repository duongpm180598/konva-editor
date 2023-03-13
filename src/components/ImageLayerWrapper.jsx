import React from "react";

const ImageLayerWrapper = ({ children }) => {
  const [toggleFlip, setToggleFlip] = React.useState({
    flippedX: false,
    flippedY: false,
  });

  const handleToggleFlip = (flippedX, flippedY) => {
    setToggleFlip({
      flippedX,
      flippedY,
    });
  };

  return children({ toggleFlip, handleToggleFlip, setToggleFlip });
};

export default ImageLayerWrapper;
