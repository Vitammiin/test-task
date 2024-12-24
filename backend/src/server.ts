import dotenv from "dotenv";
import buildApp from "./app";
import fastifyCors from "@fastify/cors";
dotenv.config();

const startServer = async () => {
  const app = buildApp();

  app.register(fastifyCors, {
    origin: "*",
    methods: ["GET", "POST"],
  });

  try {
    await app.listen({ port: 8081 });
    console.log(`Server listening at http://localhost:8081`);
  } catch (err) {
    console.error("Error starting server:", err);
    process.exit(1);
  }
};

startServer();
