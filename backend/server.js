import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyWebsocket from '@fastify/websocket';
import OpenAI from 'openai';
import { env } from './utils/env.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import { Readable } from 'stream';
import authRoutes from './routes/auth.js';
import { errorHandler } from './middlewares/errorHandler.js';
import audioRoutes from './routes/audio.js';

const fastify = Fastify({ logger: true });

fastify.register(fastifyCors, {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});

fastify.register(fastifyWebsocket);

const openai = new OpenAI({
  apiKey: env('OPENAI_API_KEY'),
});

fastify.register(audioRoutes);

fastify.register(authRoutes);

fastify.get('/stocks', async (request, reply) => {
  // Логика получения данных о акциях с использованием выбранного API
  // (Alpha Vantage, Polygon.io, Finnhub или Yahoo Finance)
});

fastify.setErrorHandler(errorHandler);

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
