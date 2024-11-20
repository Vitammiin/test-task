import { buildApp } from './app';
import { env } from './config/env';

async function start() {
    try {
        const app = await buildApp();

        await app.listen({
            port: parseInt(env.PORT) || 6002,
            host: '0.0.0.0'
        });

        console.log(`🚀 Server running on port ${env.PORT || 6002}`);
    } catch (err) {
        console.error('Error starting server:', err);
        process.exit(1);
    }
}

start();
