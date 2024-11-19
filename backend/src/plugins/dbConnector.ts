import { MongoMemoryServer } from "mongodb-memory-server";
import { FastifyPluginAsync } from "fastify";
import mongoose from "mongoose";

const dbConnector: FastifyPluginAsync = async (fastify) => {
  try {
    fastify.log.info("Attempting to connect to the database...");
    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri(); // MongoDB URI
    await mongoose.connect(uri);
    fastify.log.info("Database connected");
  } catch (error) {
    fastify.log.error("Database connection failed:", error);
    throw error;
  }
};

export default dbConnector;
