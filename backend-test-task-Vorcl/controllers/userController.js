const { registerUser } = require('../services/userService');

const userController = async (req, reply) => {
  const { email } = req.body;

  if (!email) {
    return reply.status(400).send({ message: 'Email is required' });
  }

  try {
    const user = await registerUser(email);
    return reply
      .status(201)
      .send({ message: 'User registered successfully', user });
  } catch (error) {
    if (error.message === 'A user with this email is already registered') {
      return reply.status(409).send({ message: error.message });
    }

    console.error('Registration error:', error);
    return reply
      .status(500)
      .send({ message: 'User registration error', error: error.message });
  }
};

module.exports = userController;
