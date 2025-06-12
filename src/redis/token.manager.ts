import client from './redis.client';

export interface TokenData {
  accessToken: string;
  refreshToken: string;
  accessExpires: number;
  refreshExpires: number;
}

export class TokenManager {
  private static readonly TOKEN_PREFIX = 'user_tokens:';
  private static readonly TOKEN_EXPIRY = 3600;

  private static getKey(userId: string) {
    return `${this.TOKEN_PREFIX}${userId}`;
  }

  static async storeTokens(userId: string, tokens: TokenData): Promise<void> {
    const key = this.getKey(userId);
    await client.hmset(key, this.convertTokensToStringArray(tokens));
    await client.expire(key, this.TOKEN_EXPIRY);
    const myTokens = await this.getTokens(userId);
    //console.log('myTokens:\n');
    //console.log(myTokens);
  }

  static async getTokens(userId: string): Promise<TokenData | null> {
    const key = this.getKey(userId);
    const tokens = await client.hmget(key, [
      'accessToken',
      'refreshToken',
      'accessExpires',
      'refreshExpires',
    ]);
    if (tokens.length == 4) {
      //console.log(tokens);
      return {
        accessToken: tokens[0] as string,
        refreshToken: tokens[1] as string,
        accessExpires: Number(tokens[2] as string),
        refreshExpires: Number(tokens[3] as string),
      };
    } else {
      return null;
    }

    // return Object.keys(tokens).length ? (tokens as unknown as TokenData) : null;
  }

  static async removeTokens(userId: string): Promise<void> {
    await client.del(this.getKey(userId));
  }

  private static convertTokensToStringArray(token: TokenData): string[] {
    const items: string[] = [];
    for (const [k, v] of Object.entries(token)) {
      //console.log('key: ', k, '; value: ', v);
      items.push(k, v ? v.toString() : '');
    }
    return items;
  }
}
