export async function getAudio(req, reply) {
    try {
        const db = req.server.mongo.db;
        const audio = await db.collection('audio').find({}).toArray();
        reply.send(audio);
    } catch (error) {
        console.error('Error fetching audios:', error);
        reply.status(500).send('Error fetching audios');
    }
}

export async function postAudio(req, reply) {
    try {
        console.log('Request body:', req.body);

        const { audio } = req.body;

        if (!audio) {
            return reply.status(400).send({ message: 'Audio is required' });
        }

        const db = req.server.mongo.db;

        const result = await db.collection('audio').insertOne({
            audio,
            createdAt: new Date(),
        });

        reply.status(201).send({
            message: 'Audio added successfully',
            audioId: result.insertedId,
        });
    } catch (error) {
        console.error('Error adding audio:', error);
        reply.status(500).send({ error: 'Error adding audio' });
    }
}
