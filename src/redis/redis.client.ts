import { RedisClient } from 'bun';

const client: RedisClient = new RedisClient();

// await client.connect().catch(console.error);
// client.connect().catch(console.error);
export default client;
