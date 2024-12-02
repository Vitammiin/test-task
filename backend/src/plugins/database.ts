import mongoose from 'mongoose';
import { FastifyPluginAsync } from 'fastify';

const databasePlugin: FastifyPluginAsync = async (app) => {
    const mongoUrl = process.env.MONGO_URL || '';

    try {
        await mongoose.connect(mongoUrl);
        console.log('Mongoose connected successfully');
    } catch (err) {
        console.error('Mongoose connection failed:', err);
        process.exit(1);
    }

    app.decorate('mongoose', mongoose);
};

export default databasePlugin;
