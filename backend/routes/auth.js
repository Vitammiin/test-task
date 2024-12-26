import { registerUserController } from '../controllers/auth.js';

const authRoutes = async function (fastify) {
  fastify.post('/register', {
    schema: {
      body: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
        },
        required: ['email', 'password'],
      },
    },
    handler: registerUserController,
  });

  fastify.get('/register', (request, reply) => {
    reply.send({ message: 'Registration form' });
  });
};

export default authRoutes;
