import {FastifyReply, FastifyRequest} from 'fastify';
import User from '../models/User';
import bcrypt from 'bcrypt';

export const register = async (req: FastifyRequest, reply: FastifyReply) => {

    const {email, password} = req.body as {
        email: string,
        password: string;
    };

    try {
        const candidate = await User.findOne({email: email});
        if (candidate) {
            return reply.status(409).send({message: 'User already exists!'});
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const user = new User({
            email: email,
            password: hashedPassword
        });

        const result = await user.save();

        return reply.status(201).send({
            result,
            message: 'Registration successful!',
            _id: result._id,
            userData: {
                email: user.email
            },
        });
    } catch (err) {
        console.error("Unexpected error:", err);
        reply.code(500).send({error: "Internal Server Error"});
    }

};
