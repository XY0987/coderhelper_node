import { ConfigService } from '@nestjs/config';
// redis.service.ts

import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly redisClient: Redis;

  constructor(protected configService: ConfigService) {
    this.redisClient = new Redis({
      host: configService.get('REDIS_HOST'), // Redis 服务器的主机名
      port: configService.get('REDIS_PORT'), // Redis 服务器的端口
      password: configService.get('REDIS_PASSWORD'),
    });
  }

  async hSet(key, hashkey, hashval, timeNumber?: number) {
    if (typeof hashval === 'object') {
      hashval = JSON.stringify(hashval);
    }
    await this.redisClient.hmset(key, hashkey, hashval);
    // 设置过期时间
    if (timeNumber) {
      await this.redisClient.expire(key, timeNumber);
    }
  }

  async hGetAll(key) {
    const promise = new Promise((resolve, reject) => {
      this.redisClient.hgetall(key, function (err, val) {
        if (err) {
          reject(err);
          return;
        }
        if (val == null) {
          resolve(null);
          return;
        }
        resolve(val);
      });
    });
    return promise;
  }
  async hDel(key, hashkey) {
    await this.redisClient.hdel(key, hashkey);
  }
}
