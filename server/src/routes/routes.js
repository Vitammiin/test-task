import { postEmails } from '../controllers/email.controller.js';
import { getStock } from '../controllers/stock.controller.js';

export default function routes(server) {

    server.post('/emails', postEmails);

    server.get('/stock', getStock);
}
