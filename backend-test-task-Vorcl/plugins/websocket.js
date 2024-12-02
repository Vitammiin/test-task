const WebSocket = require('ws');
const fastifyWebsocket = require('@fastify/websocket');

module.exports = async fastify => {
  fastify.register(fastifyWebsocket);

  fastify.get('/ws', { websocket: true }, (connection, req) => {
    console.log('Client connected');

    const openAIUrl =
      'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01';

    let openAISocket;

    try {
      openAISocket = new WebSocket(openAIUrl, {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'OpenAI-Beta': 'realtime=v1',
        },
      });
    } catch (error) {
      console.error('Failed to initialize OpenAI WebSocket:', error.message);
      connection.send(
        JSON.stringify({ error: 'Failed to connect to OpenAI WebSocket' })
      );
      connection.close();
      return;
    }

    openAISocket.on('open', () => {
      console.log('Connected to OpenAI WebSocket');
    });

    openAISocket.on('message', message => {
      console.log('Message from OpenAI:', message.toString());
      if (connection.readyState === WebSocket.OPEN) {
        connection.send(message.toString());
      } else {
        console.error('Client connection is not open');
      }
    });

    openAISocket.on('error', error => {
      console.error('OpenAI WebSocket error:', error.message);
      if (connection.readyState === WebSocket.OPEN) {
        connection.send(JSON.stringify({ error: 'OpenAI error occurred' }));
      }
    });

    openAISocket.on('close', () => {
      console.log('OpenAI WebSocket closed');
      if (connection.readyState === WebSocket.OPEN) {
        connection.close();
      }
    });

    connection.on('message', message => {
      console.log('Message from client:', message.toString());
      try {
        if (openAISocket.readyState === WebSocket.OPEN) {
          openAISocket.send(message.toString());
        } else {
          console.error('OpenAI WebSocket not open');
        }
      } catch (err) {
        console.error('Error processing client message:', err.message);
        connection.send(
          JSON.stringify({ error: 'Error processing your message' })
        );
      }
    });

    connection.on('close', () => {
      console.log('Client disconnected');
      if (openAISocket.readyState === WebSocket.OPEN) {
        openAISocket.close();
      }
    });
  });
};
