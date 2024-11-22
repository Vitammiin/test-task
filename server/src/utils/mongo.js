import Fastify from 'fastify';
import fastifyMongo from '@fastify/mongodb';
import dotenv from 'dotenv';
import fastifyCors from '@fastify/cors';

dotenv.config();

const server = Fastify();

server.register(fastifyCors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
});

server.register(fastifyMongo, {
    url: process.env.MONGO_URI,
    database: process.env.DB_NAME,
});

export default server;
