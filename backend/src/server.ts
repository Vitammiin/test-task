import buildApp from './app'

const start = async () => {
    try {
        const app = buildApp();
        await app.listen({ port: 4000 });
        console.log(`Server listening at http://localhost:4000`);
    } catch (err) {
        console.error("Error starting server:", err);
        process.exit(1);
    }
};

start();