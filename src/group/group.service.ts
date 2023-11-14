import { Injectable } from '@nestjs/common';
import { Group } from './group.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}

  create(groupUserId: number, groupProjectId: number, groupUserPower: number) {
    const statement = `INSERT INTO \`group\` (groupUserId,groupProjectId,groupUserPower) VALUES (?,?,?);`;
    return this.groupRepository.query(statement, [
      groupUserId,
      groupProjectId,
      groupUserPower,
    ]);
  }
}
