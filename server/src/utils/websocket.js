import { WebSocketServer } from 'ws';
import { OpenAI } from 'openai';

export const setupWebSocket = (server) => {
    const wss = new WebSocketServer({ server });

    wss.on('connection', (ws, req) => {
        console.log('Client connected');

        const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        ws.on('message', (message) => {
            console.log('Received message:', message);

            handleClientMessage(client, ws, message);
        });

        ws.on('close', () => {
            console.log('Client disconnected');
        });
    });

    console.log('WebSocket server is listening');
};

async function handleClientMessage(client, ws, message) {
    try {

        const response = await client.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: 'user', content: message }],
            stream: true,
        });

        for await (const part of response) {
            ws.send(JSON.stringify(part));
        }
    } catch (error) {
        console.error('Error processing message:', error);

        if (error.code === 'insufficient_quota') {
            ws.send(JSON.stringify({ error: 'Quota exceeded. Please check your plan.' }));
        } else {
            ws.send(JSON.stringify({ error: 'An error occurred' }));
        }
    }
}
