import { FastifyReply, FastifyRequest } from "fastify";
import authService from "../services/auth.service";
import { MongoError } from "mongodb";
import { randomUUID } from "crypto";

export const signup = async (request: FastifyRequest, reply: FastifyReply) => {
  const { email } = request.body as {
    email: string;
  };

  if (!email) {
    reply.code(400).send({ error: "Email and password are required" });
    return;
  }

  try {
    const user = await authService.createUser(email, randomUUID());
    reply.code(201).send({ message: "User registered successfully", user });
  } catch (error: unknown) {
    if (error instanceof MongoError && error.code === 11000) {
      reply.code(409).send({ error: "Email already exists" });
    } else if (error instanceof Error) {
      console.error("Error creating user:", error.message);
      reply.code(500).send({ error: error.message });
    } else {
      console.error("Unexpected error:", error);
      reply.code(500).send({ error: "Internal Server Error" });
    }
  }
};
