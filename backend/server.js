import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyWebsocket from '@fastify/websocket';
import OpenAI from 'openai';
import { env } from './utils/env.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import authRoutes from './routes/auth.js';
import { errorHandler } from './middlewares/errorHandler.js';
import audioRoutes from './routes/audio.js';
import stockRoutes from './routes/stock.js';

const fastify = Fastify({ logger: true });

fastify.register(fastifyCors, {
  origin: ['http://localhost:3000', 'https://test-task-vorcl-sand.vercel.app'],
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

fastify.register(stockRoutes);

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
