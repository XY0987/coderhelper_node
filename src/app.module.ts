import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProjectModule } from './project/project.module';
import { WorkModule } from './work/work.module';
import { InterfaceModule } from './interface/interface.module';
import { MeetingModule } from './meeting/meeting.module';
import { GroupModule } from './group/group.module';
import { CollectModule } from './collect/collect.module';
import { MessageModule } from './message/message.module';
import { MeetingUsersModule } from './meeting-users/meeting-users.module';
import { User } from './user/user.entity';
import { Project } from './project/project.entity';
import { Collect } from './collect/collect.entity';
import { Work } from './work/work.entity';
import { Group } from './group/group.entity';
import { Interface } from './interface/interface.entity';
import { Message } from './message/message.entity';
import { Meeting } from './meeting/meeting.entity';
import { MeetingUsers } from './meeting-users/meeting-users.entity';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { EventsGateway } from './events/events.gateway';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      // 注入到后边的useFactory函数中去
      inject: [ConfigService],
      useFactory: (ConfigService: ConfigService) => {
        return {
          type: 'mysql',
          host: ConfigService.get('DB_HOST'),
          port: 3306,
          username: 'root',
          password: ConfigService.get('DB_PASSWORD'),
          database: ConfigService.get('DB_BASE'),
          entities: [
            User,
            Project,
            Collect,
            Work,
            Group,
            Interface,
            Message,
            Meeting,
            MeetingUsers,
          ],
          // 同步本地的schema与数据库==>初始化的时候去使用
          synchronize: true,
          // 设置日志等级
          logging: ['error'], //设置为true时开启全部日志
        };
      },
    }),
    RedisModule,
    UserModule,
    ProjectModule,
    WorkModule,
    InterfaceModule,
    MeetingModule,
    GroupModule,
    CollectModule,
    MessageModule,
    MeetingUsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, EventsGateway],
})
export class AppModule {}
