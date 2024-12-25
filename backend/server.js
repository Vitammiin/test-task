// const fastify = require("fastify")({ logger: true });
// const WebSocket = require("fastify-websocket");
// const { MongoClient } = require("mongodb");
// const { Configuration, OpenAIApi } = require("openai");

// fastify.register(WebSocket);

// const mongoClient = new MongoClient("your_mongodb_uri");
// const openai = new OpenAIApi(
//   new Configuration({ apiKey: "your_openai_api_key" })
// );

// fastify.get("/", { websocket: true }, (connection, req) => {
//   connection.socket.on("message", async (message) => {

//   });
// });

// fastify.post("/register", async (request, reply) => {

// });

// fastify.get("/stocks", async (request, reply) => {

// });

// const start = async () => {
//   try {
//     await mongoClient.connect();
//     await fastify.listen(3000);
//   } catch (err) {
//     fastify.log.error(err);
//     process.exit(1);
//   }
// };

// start();
