import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your-secret-key';

const generateToken = (email) => {
    return jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
};

export async function postEmails(req, reply) {
    try {
        console.log('Request body:', req.body);

        const { email } = req.body; 

        if (!email) {
            return reply.status(400).send({ message: 'Email is required' });
        }

        const db = req.server.mongo.db;


        const existingEmail = await db.collection('emails').findOne({ email });

        if (existingEmail) {
            const token = generateToken(email);
            return reply.status(200).send({ message: 'Email already exists', token });
        }

        const result = await db.collection('emails').insertOne({
            email,
            createdAt: new Date(),
        });

        const token = generateToken(email);

        reply.status(201).send({
            message: 'Email added successfully',
            emailsId: result.insertedId,
            token,
        });
    } catch (error) {
        console.error('Error adding emails:', error);
        reply.status(500).send({ error: 'Error adding email' });
    }
}
