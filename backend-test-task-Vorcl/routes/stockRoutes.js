const { stockController } = require('../controllers/stockController');
const { stockSchema } = require('../schemas/stockSchema');

const stockRoutes = fastify => {
  fastify.get('/api/stock', {
    schema: stockSchema,
    handler: stockController.getStock,
  });
};

module.exports = stockRoutes;
