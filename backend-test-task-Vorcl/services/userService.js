const { MongoClient } = require('mongodb');

require('dotenv').config();

const mongoUrl = process.env.MONGO_URL;

const url = mongoUrl;
const dbName = 'backend-test-task-Vorcl';

const registerUser = async email => {
  const client = new MongoClient(url);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('users');

    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      throw new Error('A user with this email is already registered');
    }

    const newUser = { email };
    const result = await collection.insertOne(newUser);

    return {
      email,
      _id: result.insertedId,
    };
  } catch (error) {
    throw new Error(error.message || 'Database operation failed');
  } finally {
    await client.close();
  }
};

module.exports = { registerUser };
