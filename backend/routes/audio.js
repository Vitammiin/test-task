import { AIAssistantService } from '../services/audio.js';

const audioRoutes = async (server) => {
  server.get('/ws', { websocket: true }, handleWebSocketConnection);
};

function handleWebSocketConnection(connection) {
  const aiAssistant = new AIAssistantService();
  aiAssistant.setupConnection(connection.socket);

  connection.on('message', (data) => {
    aiAssistant.handleAudio(Buffer.from(data));
  });

  connection.on('close', () => {
    aiAssistant.terminate();
  });
}

export default audioRoutes;
