import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { DatabaseService } from '../services/database.service';

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    CreatedAt: z.date()
});

export async function registerRoutes(fastify: FastifyInstance) {
    fastify.post('/api/register', async (request, reply) => {
        try {
            const { email, password } = registerSchema.parse(request.body);

            const database = await db.connect();
            const hashedPassword = await bcrypt.hash(password, 12);

            await database.collection('users').insertOne({
                email,
                password: hashedPassword,
                createdAt: new Date()
            });

            return reply.code(201).send({ success: true });
        } catch (error) {
            if (error instanceof z.ZodError) {
                return reply.code(400).send({
                    error: 'VALIDATION_ERROR',
                    message: error.errors
                });
            }

            fastify.log.error(error);
            return reply.code(500).send({
                error: 'SERVER_ERROR',
                message: 'Internal server error'
            });
        }
    });
}
