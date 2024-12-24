const userController = require('../controllers/userController');
const userSchema = require('../schemas/userSchema');

module.exports = async function (fastify) {
  fastify.post('/register', {
    schema: {
      body: userSchema,
    },
    handler: userController,
  });
};
