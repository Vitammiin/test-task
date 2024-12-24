"use client";
import React, { useRef, useState } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import redAnimationData from "@/app/assets/animations/redAnimation.json"; // Red animation JSON
import blueAnimationData from "@/app/assets/animations/blueAnimation.json"; // Blue animation JSON

interface IProps {
  togglePlayState: (isPlaying: boolean) => void;
}

const Microphone = ({ togglePlayState }: IProps) => {
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlayPause = () => {
    if (lottieRef.current) {
      if (isPlaying) {
        lottieRef.current.stop();
      } else {
        lottieRef.current.play();
      }
      setIsPlaying(!isPlaying);
      togglePlayState(!isPlaying);
    }
  };

  return (
    <div className="h-[100px] w-[100px] mx-auto" onClick={togglePlayPause}>
      {isPlaying ? (
        <Lottie
          lottieRef={lottieRef}
          animationData={blueAnimationData}
          style={{ width: "100%", height: "100%" }}
          autoplay={false}
          loop={false}
        />
      ) : (
        <Lottie
          lottieRef={lottieRef}
          animationData={redAnimationData}
          style={{ width: "100%", height: "100%" }}
        />
      )}
    </div>
  );
};

export default Microphone;
