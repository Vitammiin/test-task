import { getAudio, postAudio } from '../controllers/audio.controller.js';
import { postEmails } from '../controllers/email.controller.js';
import { getStock } from '../controllers/stock.controller.js';

export default function routes(server) {
    server.get('/audio', getAudio);
    server.post('/audio', postAudio);

    server.post('/emails', postEmails);

    server.get('/stock', getStock);
}
