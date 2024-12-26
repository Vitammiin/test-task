import { OpenAIService } from '../services/audio.js';

const audioRoutes = async function (fastify) {
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
};

export default audioRoutes;
