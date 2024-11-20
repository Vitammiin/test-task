import fp from 'fastify-plugin';
import websocket, {WebsocketPluginOptions} from '@fastify/websocket';

export default fp<WebsocketPluginOptions>(async (fastify) => {
    await fastify.register(websocket, {
        options: {
            maxPayload: 100 * 1024 * 1024
        }
    });
});
