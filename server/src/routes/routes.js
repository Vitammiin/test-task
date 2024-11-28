import { postEmails } from '../controllers/email.controller.js';
import { getStock, getAllStock } from '../controllers/stock.controller.js';

export default function routes(server) {

    server.post('/emails', postEmails);

    server.get('/stock', getStock);

    server.get('/stocks', getAllStock);
}
