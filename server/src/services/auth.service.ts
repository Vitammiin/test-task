import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { DatabaseService } from './database.service';
import { env } from '../config/env';

export class AuthService {
    private db = DatabaseService.getInstance();

    async checkEmail(email: string): Promise<boolean> {
        const database = await this.db.connect();
        const users = database.collection('users');

        const existingUser = await users.findOne({ email });
        return !!existingUser;
    }

    async register(email: string, password: string) {
        const database = await this.db.connect();
        const users = database.collection('users');

        const exists = await this.checkEmail(email);
        if (exists) {
            throw new Error('EMAIL_EXISTS');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const result = await users.insertOne({
            email,
            password: hashedPassword,
            createdAt: new Date()
        });

        const token = this.generateToken(result.insertedId);

        return { success: true, userId: result.insertedId, token };
    }

    async login(email: string, password: string) {
        const database = await this.db.connect();
        const users = database.collection('users');

        const user = await users.findOne({ email });
        if (!user) {
            throw new Error('INVALID_CREDENTIALS');
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            throw new Error('INVALID_CREDENTIALS');
        }

        const token = this.generateToken(user._id);

        return {
            success: true,
            user: {
                id: user._id,
                email: user.email
            },
            token
        };
    }

    private generateToken(userId: string) {
        return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: '1h' });
    }

    verifyToken(token: string) {
        try {
            return jwt.verify(token, env.JWT_SECRET);
        } catch (error) {
            throw new Error('INVALID_TOKEN');
        }
    }
}
