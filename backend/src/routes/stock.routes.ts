import { FastifyInstance } from 'fastify';
import { getStockData, getStockPriceData } from '../controllers/stock.controller';

const stockRoutes = async (app: FastifyInstance) => {
    app.get('/stocks', getStockData);
    app.get('/stockPrice', getStockPriceData);
};

export default stockRoutes;

