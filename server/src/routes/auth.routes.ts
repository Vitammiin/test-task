import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { AuthService } from '../services/auth.service';

const emailSchema = z.object({
    email: z.string().email()
});

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
});

export async function authRoutes(fastify: FastifyInstance) {
    const authService = new AuthService();

    fastify.post('/api/auth/check-email', async (request, reply) => {
        try {
            const { email } = emailSchema.parse(request.body);

            const available = await authService.checkEmail(email);

            return reply.send({ available });

        } catch (error) {
            request.log.error('Check email error:', error);

            if (error instanceof z.ZodError) {
                return reply.code(400).send({
                    error: 'VALIDATION_ERROR',
                    message: error.errors[0].message
                });
            }

            return reply.code(500).send({
                error: 'SERVER_ERROR',
                message: 'Internal server error'
            });
        }
    });

    fastify.post('/api/auth/register', async (request, reply) => {
        try {
            const { email, password } = registerSchema.parse(request.body);

            const result = await authService.register(email, password);

            return reply.code(201).send(result);

        } catch (error) {
            request.log.error('Registration error:', error);

            if (error instanceof z.ZodError) {
                return reply.code(400).send({
                    error: 'VALIDATION_ERROR',
                    message: error.errors[0].message
                });
            }

            return reply.code(500).send({
                error: 'SERVER_ERROR',
                message: 'Internal server error'
            });
        }
    });

    fastify.post('/api/auth/login', async (request, reply) => {
        try {
            const { email, password } = registerSchema.parse(request.body);

            const result = await authService.login(email, password);

            return reply.send(result);

        } catch (error) {
            request.log.error('Login error:', error);

            if (error instanceof z.ZodError) {
                return reply.code(400).send({
                    error: 'VALIDATION_ERROR',
                    message: error.errors[0].message
                });
            }

            return reply.code(500).send({
                error: 'SERVER_ERROR',
                message: 'Internal server error'
            });
        }
    });

    fastify.get('/api/user', async (request, reply) => {
        try {
            const token = request.headers.authorization?.split(' ')[1];
            if (!token) {
                return reply.code(401).send({ error: 'NO_TOKEN', message: 'No token provided' });
            }

            const decoded = authService.verifyToken(token);

            return reply.send({ success: true, user: { /* user data */ } });

        } catch (error) {
            request.log.error('Protected route error:', error);
            return reply.code(401).send({ error: 'INVALID_TOKEN', message: 'Invalid token' });
        }
    });
}
