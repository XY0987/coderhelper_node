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
    console.log(this.redisClient);
  }

  setValue(key: string, value: string) {
    return this.redisClient.set(key, value);
  }

  getValue(key: string) {
    return this.redisClient.get(key);
  }
}
