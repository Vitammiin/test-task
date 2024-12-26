import React from 'react';
import AudioRecording from './components/AudioRecording';
import NavBar from './components/NavBar';

export default function Home() {
  return (
    <div>
      <main>
        <NavBar />
        <AudioRecording />
      </main>
    </div>
  );
}
