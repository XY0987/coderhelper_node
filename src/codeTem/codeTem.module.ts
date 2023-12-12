import { Module } from '@nestjs/common';
import { CodeTemController } from './codeTem.controller';
import { CodeTemService } from './codeTem.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodeTem } from './codeTem.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CodeTem])],
  controllers: [CodeTemController],
  providers: [CodeTemService],
})
export class CodeTemModule {}
