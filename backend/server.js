import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyWebsocket from '@fastify/websocket';
import OpenAI from 'openai';
import { env } from './utils/env.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import { Readable } from 'stream';
import authRoutes from './routes/auth.js';

const fastify = Fastify({ logger: true });

fastify.register(fastifyCors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

fastify.register(fastifyWebsocket);

const openai = new OpenAI({
  apiKey: env('OPENAI_API_KEY'),
});

fastify.get('/ws', { websocket: true }, (connection, req) => {
  let audioStream = null;
  let isConversationActive = false;

  connection.socket.on('message', async (message) => {
    const data = JSON.parse(message);

    if (data.type === 'start') {
      isConversationActive = true;
      audioStream = new Readable();
      audioStream._read = () => {};

      try {
        const response = await openai.createSpeechRecognition({
          model: 'whisper-1',
          audio: audioStream,
          language: 'en',
        });

        connection.socket.send(
          JSON.stringify({
            type: 'transcription',
            text: response.data.text,
          }),
        );

        const completion = await openai.createCompletion({
          model: 'text-davinci-003',
          prompt: response.data.text,
          max_tokens: 150,
        });

        connection.socket.send(
          JSON.stringify({
            type: 'response',
            text: completion.data.choices[0].text.trim(),
          }),
        );
      } catch (error) {
        console.error('Error processing audio:', error);
        connection.socket.send(
          JSON.stringify({
            type: 'error',
            message: 'Error processing audio',
          }),
        );
      }
    } else if (data.type === 'audio') {
      if (isConversationActive && audioStream) {
        audioStream.push(Buffer.from(data.audio, 'base64'));
      }
    } else if (data.type === 'stop') {
      isConversationActive = false;
      if (audioStream) {
        audioStream.push(null);
        audioStream = null;
      }
    }
  });

  connection.socket.on('close', () => {
    if (audioStream) {
      audioStream.push(null);
      audioStream = null;
    }
    isConversationActive = false;
  });
});

fastify.register(authRoutes);

fastify.get('/stocks', async (request, reply) => {
  // Логика получения данных о акциях с использованием выбранного API
  // (Alpha Vantage, Polygon.io, Finnhub или Yahoo Finance)
});

const PORT = Number(env('PORT', '3001'));

const start = async () => {
  try {
    await initMongoConnection();
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`Server is running on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
