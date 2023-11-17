import { Module } from '@nestjs/common';
import { InterfaceController } from './interface.controller';
import { InterfaceService } from './interface.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interface } from './interface.entity';
import { ProjectModule } from 'src/project/project.module';
import { GroupModule } from 'src/group/group.module';

@Module({
  imports: [ProjectModule, GroupModule, TypeOrmModule.forFeature([Interface])],
  controllers: [InterfaceController],
  providers: [InterfaceService],
})
export class InterfaceModule {}
