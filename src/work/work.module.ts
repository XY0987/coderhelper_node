import { Module } from '@nestjs/common';
import { WorkController } from './work.controller';
import { WorkService } from './work.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Work } from './work.entity';
import { GroupModule } from 'src/group/group.module';
import { MessageModule } from 'src/message/message.module';
import { RedisService } from 'src/redis/redis.service';

@Module({
  imports: [MessageModule, GroupModule, TypeOrmModule.forFeature([Work])],
  controllers: [WorkController],
  providers: [WorkService, RedisService],
})
export class WorkModule {}
