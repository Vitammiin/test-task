import fastify from 'fastify'
import cors from '@fastify/cors';

import websocketPlugin from "./plugins/websocket";
import databasePlugin from './plugins/database';

import audioRoues from './routes/audio.routes'
import authRoutes from './routes/auth.routes';
import stockRoutes from './routes/stock.routes';

const buildApp = () => {
    const app = fastify({logger: {level: "error"}});

    app.register(cors, {
        origin: '*',
        methods: ['GET', 'POST']
    });


    app.register(websocketPlugin);

    app.register(databasePlugin);
    app.register(audioRoues);
    app.register(stockRoutes);
    app.register(authRoutes);

    return app;
}

export default buildApp;
