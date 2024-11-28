import { WebSocketServer } from 'ws';
import { OpenAI } from 'openai';

export class RealtimeRelay {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.sockets = new WeakMap();
        this.wss = null;
    }

    listen(server) {
        this.wss = new WebSocketServer({ server });
        this.wss.on('connection', this.connectionHandler.bind(this));
        this.log(`WebSocket server is listening`);
    }

    async connectionHandler(ws, req) {
        if (!req.url) {
            this.log('No URL provided, closing connection.');
            ws.close();
            return;
        }

        const url = new URL(req.url, `http://${req.headers.host}`);
        const pathname = url.pathname;

        if (pathname !== '/') {
            this.log(`Invalid pathname: "${pathname}"`);
            ws.close();
            return;
        }

        this.log(`Connecting with key "${this.apiKey.slice(0, 3)}..."`);
        const client = new OpenAI({ apiKey: this.apiKey });

        try {
            this.log(`Setting up stream with OpenAI...`);

            const stream = client.chat.completions.create({
                messages: [{ role: 'user', content: 'Hello, world!' }],
                stream: true,
            });

            for await (const part of stream) {
                this.log(`Relaying "${part}" to Client`);
                ws.send(JSON.stringify(part));
            }

            this.log('Connected to OpenAI successfully!');
        } catch (e) {
            this.log(`Error connecting to OpenAI: ${e.message}`);
            ws.close();
            return;
        }

        const messageQueue = [];
        const messageHandler = (data) => {
            try {
                const event = JSON.parse(data);
                this.log(`Relaying "${event.type}" to OpenAI`);
                client.realtime.send(event.type, event);
            } catch (e) {
                console.error(e.message);
                this.log(`Error parsing event from client: ${data}`);
            }
        };

        ws.on('message', (data) => {
            messageHandler(data);
        });

        ws.on('close', () => client.disconnect());
    }

    log(...args) {
        console.log(`[RealtimeRelay]`, ...args);
    }
}
