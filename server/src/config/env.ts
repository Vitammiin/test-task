import {config} from 'dotenv';
import {z} from 'zod';

config();

const envSchema = z.object({
    PORT: z.string().default('6002'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    OPENAI_API_KEY: z.string(),
    FRONTEND_URL: z.string().default('http://127.0.0.1:3000'),
    CORS_ORIGINS: z.string().default('*'),
    MONGODB_URI: z.string(),
    JWT_SECRET: z.string().default('secret'),
    LOG_LEVEL: z.string().default('info'),

});

const envParse = envSchema.safeParse(process.env);

if (!envParse.success) {
    console.error('❌ Invalid environment variables:', envParse.error.flatten().fieldErrors);
    throw new Error('Invalid environment variables');
}

export const env = envParse.data;
