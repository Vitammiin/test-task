'use client';

import dynamic from 'next/dynamic';

const AudioRecordingClient = dynamic(() => import('./AudioRecordingClient'), {
  ssr: false,
});

const AudioRecording: React.FC = () => {
  return <AudioRecordingClient />;
};

export default AudioRecording;
