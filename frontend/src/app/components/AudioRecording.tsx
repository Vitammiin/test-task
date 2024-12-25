'use client';
import React, { useState } from 'react';
import Lottie from 'lottie-react';
import { Button } from '@nextui-org/react';
import { AudioVisualizer } from 'react-audio-visualize';

const AudioRecording = () => {
  const [isRecording, setIsRecording] = useState(false);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Здесь будет логика для начала/окончания записи
  };

  return (
    <div>
      {/* <Lottie animationData=Ваша Lottie анимация /> */}
      <Button
        onClick={toggleRecording}
        color={isRecording ? 'danger' : 'primary'}
      >
        {isRecording ? 'End conversation' : 'Start conversation'}
      </Button>
      {/* {isRecording && <AudioVisualizer />} */}
    </div>
  );
};

export default AudioRecording;
