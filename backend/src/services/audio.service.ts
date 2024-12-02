import WebSocket from 'ws';
import { processAudioForOpenAI } from './decoder.service';

const OpenAiToken = process.env.MONGO_URL || "";

export class OpenAIService {
    private ws: WebSocket | null = null;
    private clientWs: WebSocket | null = null;
    private sessionTimeout: NodeJS.Timeout | null = null;

    constructor() {
        this.initializeWebSocket = this.initializeWebSocket.bind(this);
        this.handleMessage = this.handleMessage.bind(this);
        this.handleError = this.handleError.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    initializeWebSocket(clientWs: WebSocket) {
        this.clientWs = clientWs;

        const url = "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01";
        this.ws = new WebSocket(url, {
            headers: {
                "Authorization": 'Bearer ' + OpenAiToken,
                "OpenAI-Beta": "realtime=v1"
            }
        });

        this.ws.on('open', this.handleOpen.bind(this));
        this.ws.on('message', this.handleMessage);
        this.ws.on('error', this.handleError);
        this.ws.on('close', this.handleClose);
    }

    private handleOpen() {
        console.log('Connected to OpenAI WebSocket');
        this.sendSessionConfig();
    }

    private sendSessionConfig() {
        if (!this.ws) return;

        const sessionConfig = {
            type: 'session.update',
            session: {
                turn_detection: {
                    type: 'server_vad',
                    threshold: 0.7,
                    prefix_padding_ms: 400,
                    silence_duration_ms: 350
                },
                input_audio_format: 'pcm16',
                output_audio_format: 'pcm16',
                voice: 'alloy',
                instructions: "You are a helpful and friendly AI assistant.",
                modalities: ['text', 'audio'],
                temperature: 0.8,
                max_response_output_tokens: 'inf'
            }
        };

        console.log('Sending session config:', sessionConfig);
        this.ws.send(JSON.stringify(sessionConfig));
    }

    processAudioData(audioData: Buffer) {
        if (!this.ws) return;

        try {
            const float32Data = new Float32Array(audioData.buffer);
            const sampleRate = 48000;

            const base64Audio = processAudioForOpenAI(float32Data, sampleRate);


            const message = {
                type: 'input_audio_buffer.append',
                audio: base64Audio
            };

            console.log('Sending audio data:', {
                originalSize: audioData.length,
                processedSize: base64Audio.length,
                sampleRate: '24kHz',
                format: 'mono PCM16'
            });

            this.ws.send(JSON.stringify(message));
        } catch (error) {
            console.error('Error processing audio data:', error);
            if (this.clientWs) {
                this.clientWs.send(JSON.stringify({
                    type: 'error',
                    error: {
                        message: 'Error processing audio data'
                    }
                }));
            }
        }
    }

    private handleMessage(message: WebSocket.RawData) {
        try {
            const data = JSON.parse(message.toString());
            console.log('Received message:', data);

            switch (data.type) {
                case 'session.created':
                    console.log('Session created successfully');
                    break;

                case 'error':
                    console.error('OpenAI error:', data.error);
                    if (this.clientWs) {
                        this.clientWs.send(JSON.stringify({
                            type: 'error',
                            error: data.error
                        }));
                    }
                    break;

                case 'response.audio.delta':
                    console.log('Received response.audio.delta:', data);
                    break;

                case 'response.text.delta':
                    if (this.clientWs && data.delta) {
                        this.clientWs.send(JSON.stringify(data));
                    }
                    break;
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    }

    private handleError(error: Error) {
        console.error('OpenAI WebSocket error:', error);
        if (this.clientWs) {
            this.clientWs.send(JSON.stringify({
                type: 'error',
                error: {
                    message: 'OpenAI connection error'
                }
            }));
        }
    }

    private handleClose() {
        console.log('OpenAI WebSocket connection closed');
        if (this.sessionTimeout) {
            clearTimeout(this.sessionTimeout);
        }
        this.ws = null;
    }

    close() {
        if (this.sessionTimeout) {
            clearTimeout(this.sessionTimeout);
        }
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.clientWs = null;
    }
}