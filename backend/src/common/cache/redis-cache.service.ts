import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisCacheService implements OnModuleDestroy {
  private readonly client: Redis;

  constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      maxRetriesPerRequest: 1,
      // Never let a Redis hiccup break the request path — callers treat
      // a failed cache read/write as a cache miss, not an error.
      enableOfflineQueue: true,
    });
    this.client.on('error', (err) => {
      console.error('RedisCacheService connection error:', err.message);
    });
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const raw = await this.client.get(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch (err) {
      console.error(`RedisCacheService.get(${key}) failed:`, err.message);
      return null;
    }
  }

  async set(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    try {
      await this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch (err) {
      console.error(`RedisCacheService.set(${key}) failed:`, err.message);
    }
  }

  async del(keys: string | string[]): Promise<void> {
    const list = Array.isArray(keys) ? keys : [keys];
    if (!list.length) return;
    try {
      await this.client.del(...list);
    } catch (err) {
      console.error('RedisCacheService.del failed:', err.message);
    }
  }

  async delByPrefix(prefix: string): Promise<void> {
    try {
      const stream = this.client.scanStream({
        match: `${prefix}*`,
        count: 100,
      });
      const keysToDelete: string[] = [];
      for await (const keys of stream) {
        keysToDelete.push(...(keys as string[]));
      }
      if (keysToDelete.length) await this.client.del(...keysToDelete);
    } catch (err) {
      console.error(
        `RedisCacheService.delByPrefix(${prefix}) failed:`,
        err.message,
      );
    }
  }

  async onModuleDestroy() {
    await this.client.quit();
  }
}
