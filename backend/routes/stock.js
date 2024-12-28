import { getStock, getAllStock } from '../controllers/stock.js';

const stockRoutes = (fastify) => {
  fastify.get('/stock', getStock);
  fastify.get('/stocks', getAllStock);
};

export default stockRoutes;
