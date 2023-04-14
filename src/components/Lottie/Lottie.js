import React from "react";
import LottieRender from "react-lottie";

const Lottie = (props) => {
  const { animationData, height, width } = props;

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div>
      <LottieRender options={defaultOptions} height={height} width={width} />
    </div>
  );
};

export default Lottie;
