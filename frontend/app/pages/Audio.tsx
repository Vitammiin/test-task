import React, { useState } from "react";
import Microphone from "../componenets/Microphone";

const Audio = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="box-container">
      <div className="flex flex-col gap-20 align-center justify-center text-center">
        <p>{isPlaying ? 'Stop conversation' : 'Start a conversation with assistants'}</p>
        <Microphone togglePlayState={setIsPlaying}/>
      </div>
    </div>
  );
};

export default Audio;
