import { RedisClient } from 'bun';

const client: RedisClient = new RedisClient(process.env.REDIS_DB);

async function connect() {
  try {
    await client.connect();
    console.log('Connected to redis successfully');
  } catch (error) {
    console.error('Redis connection error', error);
    throw error;
  }
}

connect();

export default client;
