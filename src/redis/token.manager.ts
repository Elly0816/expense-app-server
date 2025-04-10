import client from './redis.client';

interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export class TokenManager {
  private static readonly TOKEN_PREFIX = 'user_tokens:';
  private static readonly TOKEN_EXPIRY = 3600;

  private static getKey(userId: string) {
    return `${this.TOKEN_PREFIX}${userId}`;
  }

  static async storeTokens(userId: string, tokens: TokenData): Promise<void> {
    const key = this.getKey(userId);
    await client.hmset(key, {
      ...tokens,
      expiresAt: Date.now() + this.TOKEN_EXPIRY * 1000,
    });
    await client.expire(key, this.TOKEN_EXPIRY);
  }

  static async getTokens(userId: string): Promise<TokenData | null> {
    const key = this.getKey(userId);
    const tokens = await client.hgetall(key);
    return Object.keys(tokens).length ? (tokens as unknown as TokenData) : null;
  }

  static async removeTokens(userId: string): Promise<void> {
    await client.del(this.getKey(userId));
  }
}
