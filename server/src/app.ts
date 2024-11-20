import Fastify, {FastifyInstance} from 'fastify';
import {env} from './config/env';
import websocketPlugin from './plugins/websocket.plugin';
import corsPlugin from './plugins/cors.plugin';
import {websocketRoutes} from './routes/websocket.routes';
import {healthRoutes} from './routes/health.routes';
import { registerRoutes } from './routes/register.routes';
import { authRoutes } from './routes/auth.routes';

export async function buildApp(): Promise<FastifyInstance> {
    const fastify = Fastify({
        logger: {
            level: env.NODE_ENV === 'development' ? 'debug' : 'info',
            transport: env.NODE_ENV === 'development'
                ? { target: 'pino-pretty' }
                : undefined
        }
    });

    await fastify.register(corsPlugin)
    await fastify.register(websocketPlugin);

    await fastify.register(authRoutes);
    await fastify.register(registerRoutes);
    await fastify.register(websocketRoutes);
    await fastify.register(healthRoutes);

    return fastify;
}
