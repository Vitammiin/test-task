import { WebSocketServer } from 'ws';

export function setupWebSocket(server) {
    const wss = new WebSocketServer({ server });

    wss.on('connection', (ws) => {
        console.log('New WebSocket connection established');

        ws.on('message', (message) => {
            if (Buffer.isBuffer(message)) {

                console.log('Received audio data:', message);

                ws.send(JSON.stringify({ status: 'audio_received' }));
            } else {
                try {
                    const data = JSON.parse(message);

                    if (data.action === 'start') {
                        console.log('Starting conversation...');
                        ws.send(JSON.stringify({ status: 'conversation_started' }));
                    }
                    if (data.action === 'stop') {
                        console.log('Stopping conversation...');
                        ws.send(JSON.stringify({ status: 'conversation_stopped' }));
                    }
                } catch (error) {
                    console.error('Error parsing message:', error);
                    ws.send(JSON.stringify({ status: 'error', message: 'Invalid message format' }));
                }
            }
        });

        ws.on('close', () => {
            console.log('WebSocket connection closed');
        });
    });

    return wss;
}
