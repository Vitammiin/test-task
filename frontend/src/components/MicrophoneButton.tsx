'use client';

import React, { useState, useEffect, useRef } from "react";
import dynamic from 'next/dynamic';
import blueLottie from "../../public/lottie/BlueAnimation.json";
import redLottie from "../../public/lottie/RedAnimation.json";

const Player = dynamic(
    () => import('@lottiefiles/react-lottie-player').then(mod => mod.Player),
    { ssr: false }
);

const MicrophoneButton: React.FC = () => {
    const [isActive, setIsActive] = useState<boolean>(false);
    const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
    const [ws, setWs] = useState<WebSocket | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationFrameRef = useRef<number>();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        return () => {
            stopRecording();
            if (ws) {
                ws.close();
            }
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    const drawVisualizer = (dataArray: Uint8Array, bufferLength: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const WIDTH = canvas.width;
        const HEIGHT = canvas.height;

        animationFrameRef.current = requestAnimationFrame(() =>
            drawVisualizer(dataArray, bufferLength)
        );

        analyserRef.current?.getByteFrequencyData(dataArray);

        ctx.fillStyle = '#f5f5f5';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        const barWidth = (WIDTH / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] / 2;
            const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
            gradient.addColorStop(0, '#4e9dff');
            gradient.addColorStop(1, '#2979ff');

            ctx.fillStyle = gradient;
            ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

            x += barWidth + 1;
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setAudioStream(stream);

            const socket = new WebSocket('ws://localhost:4000/ws');

            socket.onopen = () => {
                console.log("WebSocket connection established");

                const recorder = new MediaRecorder(stream, {
                    mimeType: 'audio/webm;codecs=opus'
                });

                recorder.ondataavailable = (event) => {
                    if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
                        socket.send(event.data);
                    }
                };

                recorder.start(100);
                mediaRecorderRef.current = recorder;
            };

            socket.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            socket.onclose = () => {
                console.log('WebSocket connection closed');
                stopRecording();
            };

            setWs(socket);

            audioContextRef.current = new AudioContext();
            analyserRef.current = audioContextRef.current.createAnalyser();
            const source = audioContextRef.current.createMediaStreamSource(stream);

            analyserRef.current.fftSize = 256;
            const bufferLength = analyserRef.current.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            source.connect(analyserRef.current);

            drawVisualizer(dataArray, bufferLength);
            setIsActive(true);

        } catch (error) {
            console.error("Error accessing microphone:", error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current = null;
        }

        if (audioStream) {
            audioStream.getTracks().forEach(track => track.stop());
            setAudioStream(null);
        }

        if (ws) {
            ws.close();
            setWs(null);
        }

        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }

        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }

        setIsActive(false);
    };

    const handleClick = () => {
        if (isActive) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    return (
        <div className="text-center">
            <div className="mb-2 text-lg font-bold">
                {isActive ? "End conversation" : "Start conversation"}
            </div>

            <div
                onClick={handleClick}
                className="w-36 h-36 cursor-pointer inline-block rounded-full relative"
            >
                {typeof window !== 'undefined' && (
                    <Player
                        loop
                        autoplay={isActive}
                        src={isActive ? redLottie : blueLottie}
                        className="w-full h-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    />
                )}
            </div>

            <div className="mt-4">
                <canvas
                    ref={canvasRef}
                    width={500}
                    height={100}
                    className="bg-gray-100 rounded-lg"
                />
            </div>
        </div>
    );
};

export default MicrophoneButton;