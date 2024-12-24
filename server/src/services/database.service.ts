import { MongoClient, Db } from 'mongodb';
import { env } from '../config/env';

export class DatabaseService {
    private static instance: DatabaseService;
    private client: MongoClient | null = null;
    private db: Db | null = null;

    private constructor() {}

    static getInstance(): DatabaseService {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
        }
        return DatabaseService.instance;
    }

    async connect() {
        if (!this.client) {
            try {
                this.client = await MongoClient.connect(env.MONGODB_URI);
                this.db = this.client.db('auth-db');
                console.log('Successfully connected to MongoDB');
            } catch (error) {
                console.error('MongoDB connection error:', error);
                throw error;
            }
        }
        return this.db;
    }

    getDb() {
        if (!this.db) {
            throw new Error('Database not connected');
        }
        return this.db;
    }
}
