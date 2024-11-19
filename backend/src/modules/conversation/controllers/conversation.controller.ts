import { FastifyInstance } from "fastify";
import { ConversationService } from "../services/conversation.service";

export const conversationController = (app: FastifyInstance) => {
  const conversationService = new ConversationService(
    process.env.OPENAI_API_KEY as string
  );

  app.post("/start", async (request, reply) => {
    const { message } = request.body as { message: string };
    try {
      const response = await conversationService.startConversation(message);
      reply.send({ response });
    } catch (err) {
      reply.status(500).send({ error: "Failed to start conversation" });
    }
  });

  app.post("/end", async (request, reply) => {
    try {
      conversationService.endConversation();
      reply.send({ message: "Conversation ended successfully" });
    } catch (err) {
      reply.status(500).send({ error: "Failed to end conversation" });
    }
  });
};
