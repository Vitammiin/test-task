import fastify from "fastify";
import fastifyWebsocket from "@fastify/websocket";
import authRoutes from "./modules/auth/routes/auth.routes";
import dbConnector from "./plugins/dbConnector";
import { conversationWebSocket } from "./modules/conversation/websocket/conversation.websocket";
import { conversationController } from "./modules/conversation/controllers/conversation.controller";

const buildApp = () => {
  const app = fastify({ logger: { level: "error" } });

  app.register(fastifyWebsocket);
  conversationWebSocket(app);

  app.register(dbConnector);
  app.register(authRoutes, { prefix: "/api/auth" });
  app.register(conversationController, { prefix: "/api/conversation" });

  return app;
};

export default buildApp;
