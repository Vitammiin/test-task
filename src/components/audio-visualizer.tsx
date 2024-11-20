"use client";

import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
    isRecording: boolean;
    audioStream: MediaStream;
}

export function AudioVisualizer({ isRecording, audioStream }: AudioVisualizerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>();
    const analyserRef = useRef<AnalyserNode>();

    useEffect(() => {
        if (isRecording && audioStream && canvasRef.current) {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const source = audioContext.createMediaStreamSource(audioStream);
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            source.connect(analyser);
            analyserRef.current = analyser;

            const draw = () => {
                const canvas = canvasRef.current;
                if (!canvas || !analyserRef.current) return;

                const ctx = canvas.getContext('2d');
                if (!ctx) return;

                const WIDTH = canvas.width;
                const HEIGHT = canvas.height;
                const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

                analyserRef.current.getByteFrequencyData(dataArray);

                ctx.clearRect(0, 0, WIDTH, HEIGHT);

                const barWidth = (WIDTH / dataArray.length) * 2.5;
                let x = 0;

                for (const element of dataArray) {
                    const barHeight = (element / 255) * HEIGHT;

                    const gradient = ctx.createLinearGradient(0, HEIGHT, 0, HEIGHT - barHeight);
                    gradient.addColorStop(0, '#7C3AED');
                    gradient.addColorStop(1, '#C4B5FD');

                    ctx.fillStyle = gradient;

                    ctx.beginPath();
                    ctx.roundRect(
                        x,
                        HEIGHT - barHeight,
                        barWidth,
                        barHeight,
                        [4, 4, 0, 0]
                    );
                    ctx.fill();

                    x += barWidth + 1;
                }

                animationRef.current = requestAnimationFrame(draw);
            };

            draw();

            return () => {
                if (animationRef.current) {
                    cancelAnimationFrame(animationRef.current);
                }
                audioContext.close();
            };
        }
    }, [isRecording, audioStream]);

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-24 rounded-lg bg-gray-800/50"
            width={800}
            height={96}
        />
    );
}
