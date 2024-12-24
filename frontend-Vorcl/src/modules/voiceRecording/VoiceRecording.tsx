'use client';

import { useEffect, useRef, useState } from 'react';
import { useLottie } from 'lottie-react';
import freeVoiceAnimation from '../../assets/animations/freeVoiceAnimation.json';
import { LiveAudioVisualizer } from 'react-audio-visualize';
import Section from '@/shared/components/Section';

const VoiceRecording = () => {
  const { View, play, stop } = useLottie({
    animationData: freeVoiceAnimation,
    loop: true,
    autoplay: false,
    style: { width: '100%', height: '100%' },
  });

  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const socketUrl = 'ws://localhost:3001/ws';
    const newSocket = new WebSocket(socketUrl);

    newSocket.onopen = () => {
      console.log('WebSocket connection established');
    };

    newSocket.onerror = err => {
      console.error('WebSocket error:', err);
    };

    newSocket.onclose = event => {
      console.log('WebSocket closed:', event);
      if (!event.wasClean) {
        console.error(
          'Unexpected close, code:',
          event.code,
          'reason:',
          event.reason
        );
      }
    };

    setSocket(newSocket);

    return () => {
      if (newSocket.readyState === WebSocket.OPEN) {
        newSocket.close();
      }
    };
  }, []);

  const sendAudioToServer = (audioData: Float32Array) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ audioData }));
    } else {
      console.error('WebSocket is not open');
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);

      if (audioRef.current) {
        audioRef.current.srcObject = stream;
        audioRef.current.play();
      }

      setIsRecording(true);

      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      recorder.ondataavailable = async event => {
        const audioContext = new AudioContext();
        const arrayBuffer = await event.data.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        const channelData = audioBuffer.getChannelData(0);

        sendAudioToServer(channelData);
      };

      recorder.start();
    } catch (err) {
      console.error('Error accessing the microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }

    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
      setAudioStream(null);
    }

    setIsRecording(false);
  };

  const handleToggle = () => {
    if (isPlaying) {
      stop();
      stopRecording();
    } else {
      play();
      startRecording();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div>
      <Section styles={'min-w-[552px]'}>
        <div className="mb-[26px] text-center">
          {isRecording && mediaRecorder ? (
            <LiveAudioVisualizer
              mediaRecorder={mediaRecorder}
              width={213}
              height={15}
              barColor={'violet'}
            />
          ) : (
            'Start a conversation with assistants'
          )}
        </div>

        <div
          className={`cursor-pointer w-[185px] h-[176px] mx-auto block ${
            isPlaying ? 'svg-style' : ''
          }`}
          onClick={handleToggle}
        >
          {View}
        </div>

        <audio ref={audioRef} style={{ display: 'none' }} />
      </Section>
    </div>
  );
};

export default VoiceRecording;
