import { postEmails } from '../controllers/email.controller.js';
<<<<<<< HEAD
import { getStock, getAllStock } from '../controllers/stock.controller.js';
=======
import { getStock } from '../controllers/stock.controller.js';
>>>>>>> 6942a21e16f9939721cc71e7aa7eaea6e50d0864

export default function routes(server) {

    server.post('/emails', postEmails);

    server.get('/stock', getStock);
<<<<<<< HEAD

    server.get('/stocks', getAllStock);
=======
>>>>>>> 6942a21e16f9939721cc71e7aa7eaea6e50d0864
}
