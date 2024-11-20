import {FastifyInstance} from 'fastify';
import { OpenAIService } from './openai.service';

export async function websocketRoutes(fastify: FastifyInstance) {
    fastify.get('/ws', { websocket: true }, (connection) => {
        const openAIService = new OpenAIService();
        openAIService.initializeWebSocket(connection.socket);

        connection.on('message', (message) => {
            openAIService.processAudioData(Buffer.from(message));
        });

        connection.on('close', () => {
            openAIService.close();
        });
    });
}
