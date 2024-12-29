import WebSocket from 'ws';
import { prepareAudioForAI } from './audioDecoder.js';
import { env } from '../utils/env.js';

const AIApiToken = env('OPENAI_API_KEY') || '';
export class AIAssistantService {
  constructor() {
    this.connection = null;
    this.userConnection = null;
    this.sessionTimer = null;
    this.audioBuffer = new Float32Array(0);
    this.setupConnection = this.setupConnection.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this.onError = this.onError.bind(this);
    this.onDisconnect = this.onDisconnect.bind(this);
  }

  setupConnection(userWs) {
    this.userConnection = userWs;

    const endpoint =
      'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01';
    this.connection = new WebSocket(endpoint, {
      headers: {
        Authorization: 'Bearer ' + AIApiToken,
        'OpenAI-Beta': 'realtime=v1',
      },
    });

    this.connection.on('open', () => this.onConnect());
    this.connection.on('message', this.onMessage);
    this.connection.on('error', this.onError);
    this.connection.on('close', this.onDisconnect);
  }

  onConnect() {
    console.log('AI Assistant WebSocket connected');
    this.configureSession();
  }

  configureSession() {
    if (!this.connection) return;

    const config = {
      type: 'session.update',
      session: {
        turn_detection: {
          type: 'server_vad',
          threshold: 0.7,
          prefix_padding_ms: 400,
          silence_duration_ms: 400,
        },
        input_audio_format: 'pcm16',
        output_audio_format: 'pcm16',
        voice: 'alloy',
        instructions: 'You are a helpful and friendly AI assistant.',
        modalities: ['text', 'audio'],
        temperature: 0.8,
        max_response_output_tokens: 'inf',
      },
    };

    console.log('Configuring session:', config);
    this.connection.send(JSON.stringify(config));
  }

  handleAudio(audioInput) {
    if (!this.connection) return;

    try {
      const audioFloat32 =
        audioInput instanceof Float32Array
          ? audioInput
          : new Float32Array(audioInput);

      const sampleFreq = 48000;
      const minSamples = Math.ceil(sampleFreq * 0.1);
      console.log('audioFloat32.length', audioFloat32.length);

      if (audioFloat32.length < minSamples) {
        console.log('Audio buffer too small, skipping');
        return;
      }

      const encodedAudio = prepareAudioForAI(audioFloat32, sampleFreq);
      console.log('--------encodedAudio', encodedAudio);
      const payload = {
        type: 'input_audio_buffer.append',
        audio: encodedAudio,
      };
      console.log('---------input payload', payload);
      console.log('Transmitting audio:', {
        rawSize: audioInput.length,
        encodedSize: encodedAudio.length,
        frequency: '24kHz',
        format: 'mono PCM16',
      });

      this.connection.send(JSON.stringify(payload));
      this.connection.send(
        JSON.stringify({ type: 'input_audio_buffer.commit' }),
      );
      this.initiateResponse();
    } catch (err) {
      console.error('Audio processing failed:', err);
      this.userConnection?.send(
        JSON.stringify({
          type: 'error',
          error: { message: 'Audio processing failed' },
        }),
      );
    }
  }

  sendMessage(message) {
    if (!this.connection) return;
    console.log('-----message', message);
    const payload = {
      type: 'conversation.item.create',
      content: [
        {
          type: 'text',
          text: message,
        },
      ],
    };

    this.connection.send(JSON.stringify(payload));
    this.initiateResponse();
  }

  onMessage(msg) {
    try {
      const content = JSON.parse(msg.toString());
      console.log('Incoming message:', content);

      switch (content.type) {
        case 'session.created':
          console.log('Session initialized');
          break;
        case 'error':
          console.error('AI Assistant error:', content.error);
          this.userConnection?.send(
            JSON.stringify({
              type: 'error',
              error: content.error,
            }),
          );
          break;
        case 'response.audio.delta':
          console.log('Audio response delta:', content);
          if (content.delta && this.userConnection) {
            this.userConnection.send(
              JSON.stringify({
                type: 'audio',
                data: content.delta,
              }),
            );
          }
          break;
        case 'response.text.delta':
          content.delta && this.userConnection?.send(JSON.stringify(content));
          break;
        case 'session.updated':
          console.log('Session updated:', content);
          break;
        case 'response.done':
          if (content.response?.status === 'failed') {
            console.error('Response failed:', content.response?.status_details);
            this.userConnection?.send(
              JSON.stringify({
                type: 'error',
                error: { message: 'Response failed' },
              }),
            );
          } else {
            console.log('Response completed successfully');
          }
          break;
        case 'response.created':
          console.log('Response created:', content);
          break;
        default:
          console.log('Unhandled message type:', content.type);
          this.userConnection?.send(
            JSON.stringify({
              type: 'debug',
              message: 'Unhandled message type received',
              details: content,
            }),
          );
      }
    } catch (err) {
      console.error('Message processing failed:', err);
    }
  }

  initiateResponse() {
    if (!this.connection) return;

    const payload = {
      type: 'response.create',
      response: {
        modalities: ['text', 'audio'],
      },
    };

    this.connection.send(JSON.stringify(payload));
  }

  onError(err) {
    console.error('AI Assistant WebSocket error:', err);
    const errorMessage = err.message || 'Unknown error occurred';
    this.userConnection?.send(
      JSON.stringify({
        type: 'error',
        error: { message: `AI Assistant connection error: ${errorMessage}` },
      }),
    );
  }

  onDisconnect() {
    console.log('AI Assistant WebSocket disconnected');
    this.sessionTimer && clearTimeout(this.sessionTimer);
    this.connection = null;
  }

  terminate() {
    this.sessionTimer && clearTimeout(this.sessionTimer);
    if (this.connection) {
      this.connection.close();
      this.connection = null;
    }
    this.userConnection = null;
  }
}
