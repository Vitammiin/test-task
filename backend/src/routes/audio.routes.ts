import {FastifyInstance} from 'fastify';
import { OpenAIService } from '../services/audio.service';

const audioRoues = async function (fastify: FastifyInstance) {
    fastify.get('/ws', { websocket: true }, (connection) => {
        const openAIService = new OpenAIService();
        // @ts-ignore
        openAIService.initializeWebSocket(connection.socket);

        connection.on('message', (message) => {
            // @ts-ignore
            openAIService.processAudioData(Buffer.from(message));
        });

        connection.on('close', () => {
            openAIService.close();
        });
    });
}

export default audioRoues