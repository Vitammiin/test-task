const fastify = require('fastify')({ logger: true });
const websocketPlugin = require('./plugins/websocket');
const userRoutes = require('./routes/userRoutes');
const cors = require('@fastify/cors');
const stockRoutes = require('./routes/stockRoutes');

require('dotenv').config();

const PORT = process.env.PORT || 3001;

fastify.addHook('onRequest', (request, reply, done) => {
  reply.header('Access-Control-Allow-Origin', '*');
  done();
});

fastify.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

fastify.register(websocketPlugin);
fastify.register(userRoutes);
fastify.register(stockRoutes);

const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    console.log(
      `Server is running at ${
        process.env.BASE_URL || `http://localhost:${PORT}`
      }`
    );
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
