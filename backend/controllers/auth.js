import { registerUser } from '../services/auth.js';

export const registerUserController = async (req, reply) => {
  const user = await registerUser(req.body);

  reply.status(201).send({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};
