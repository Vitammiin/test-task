import fp from 'fastify-plugin';
import cors, {FastifyCorsOptions} from '@fastify/cors';
import {env} from '../config/env';

export default fp<FastifyCorsOptions>(async (fastify) => {
    await fastify.register(cors, {
        origin: env.CORS_ORIGINS === '*' ? true : env.CORS_ORIGINS.split(','),
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true,
    });
});
