import server from './src/utils/mongo.js';
import dotenv from 'dotenv';
import routes from './src/routes/routes.js';
import { setupWebSocket } from './src/utils/websocket.js';

dotenv.config();

server.register(routes);

const port = process.env.PORT;

server.listen({ port: Number(port), host: '0.0.0.0' }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }

    setupWebSocket(server.server);

    console.log(`Server listening at ${address}`);
});
