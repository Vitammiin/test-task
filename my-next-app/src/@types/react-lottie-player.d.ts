declare module "@lottiefiles/react-lottie-player" {
  import React from "react";

  interface PlayerProps {
    autoplay?: boolean;
    loop?: boolean;
    src: string | object;
    style?: React.CSSProperties;
    speed?: number;
    direction?: number;
    onEvent?: (event: string) => void;
  }

  const Player: React.FC<PlayerProps>;

  export { Player };
}
