import { FastifyInstance } from "fastify";
import { register } from "../controllers/auth.controller";

const authRoutes = async (app: FastifyInstance) => {
    app.post("/register", register);
};

export default authRoutes;