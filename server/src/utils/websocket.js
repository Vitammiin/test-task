import { WebSocketServer } from 'ws';
<<<<<<< HEAD
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
=======

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
>>>>>>> 6942a21e16f9939721cc71e7aa7eaea6e50d0864
}
