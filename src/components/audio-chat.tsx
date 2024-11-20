"use client";

import React, { useEffect, useState } from 'react';
import { Mic } from 'lucide-react';
import { useWebSocket } from '../hooks/use-websocket';
import { AudioVisualizer } from './audio-visualizer';

const LoadingDots = () => (
    <div className="flex space-x-2">
        {[...Array(4)].map((_, i) => (
            <div
                key={i}
                className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"
                style={{
                    animationDelay: `${i * 0.2}s`
                }}
            />
        ))}
    </div>
);

export function AudioChat() {
    const [currentScreen, setCurrentScreen] = useState('initial');
    const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const { connect, disconnect, sendMessage, lastMessage } = useWebSocket();

    useEffect(() => {
        if (lastMessage) {
            const data = JSON.parse(lastMessage.data);
            console.log('Received message:', data);
        }
    }, [lastMessage]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setAudioStream(stream);
            setIsRecording(true);
            setCurrentScreen('recording');
            connect();

            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    sendMessage(event.data);
                }
            };
            mediaRecorder.start(100);
        } catch (err) {
            console.error('Error accessing microphone:', err);
        }
    };

    const stopRecording = () => {
        if (audioStream) {
            audioStream.getTracks().forEach(track => track.stop());
            setAudioStream(null);
        }
        disconnect();
        setIsRecording(false);
        setCurrentScreen('initial');
    };

    return (
        <div className="w-[480px] bg-gray-900/50 rounded-lg shadow-xl">
            <div className="p-8">
                <div className="flex flex-col items-center justify-center space-y-6">
                    {/* Visualization */}
                    {isRecording && audioStream && (
                        <div className="w-full">
                            <AudioVisualizer
                                isRecording={isRecording}
                                audioStream={audioStream}
                            />
                        </div>
                    )}

                    {currentScreen === 'initial' ? (
                        <>
                            <p className="text-gray-300 text-sm">
                                Start a conversation with assistants
                            </p>
                            <button
                                onClick={startRecording}
                                className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center hover:bg-purple-700 transition-colors"
                            >
                                <Mic className="w-5 h-5 text-white" />
                            </button>
                        </>
                    ) : (
                        <>
                            <LoadingDots />
                            <button
                                onClick={stopRecording}
                                className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center hover:bg-red-700 transition-colors"
                            >
                                <Mic className="w-5 h-5 text-white" />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
