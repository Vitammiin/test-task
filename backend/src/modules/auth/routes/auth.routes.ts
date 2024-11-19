import { FastifyInstance } from "fastify";
import { signup } from "../controllers/auth.controller";

const authRoutes = async (app: FastifyInstance) => {
  app.post("/signup", signup);
};

export default authRoutes;
