declare module "react-audio-visualize" {
  import React from "react";

  interface AudioVisualizeProps {
    audio: MediaStream;
    width?: number;
    height?: number;
    barColor?: string;
    backgroundColor?: string;
    barWidth?: number;
    barSpacing?: number;
  }

  const AudioVisualize: React.FC<AudioVisualizeProps>;

  export default AudioVisualize;
}
