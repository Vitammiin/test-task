import { Email } from '../models/email.model.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your-secret-key';

const generateToken = (email) => {
    return jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
};

export async function postEmails(req, reply) {
    try {
        const { email } = req.body;

        if (!email) {
            return reply.status(400).send({ message: 'Email is required' });
        }

        const existingEmail = await Email.findOne({ email });

        if (existingEmail) {
            const token = generateToken(email);
            return reply.status(200).send({ message: 'Email already exists', token });
        }

        const newEmail = await Email.create({ email });

        const token = generateToken(email);

        reply.status(201).send({
            message: 'Email added successfully',
            emailsId: newEmail._id,
            token,
        });
    } catch (error) {
        console.error('Error adding email:', error);
        reply.status(500).send({ error: 'Error adding email' });
    }
}
