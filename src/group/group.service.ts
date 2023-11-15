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

  // 根据项目项目id和用户id查找用户权限
  findGroupByPIdUId(projectId: number, userId: number) {
    const statement = `SELECT * FROM \`group\` WHERE groupProjectId=? AND groupUserId=?;`;
    return this.groupRepository.query(statement, [projectId, userId]);
  }

  getAllUsersByProjectId(projectId: number) {
    const statement = `SELECT 
    userId userId,
    userName userName,
    userEmail userEmail,
    userSlogan userSlogan,
    userImg userImg,
    groupUserPower projectPower
     FROM \`group\` LEFT JOIN \`user\` ON userId=groupUserId WHERE groupProjectId=?;`;
    return this.groupRepository.query(statement, [projectId]);
  }

  // 删除项目中的人，不传用户id表示全部删除
  delProjectUser(projectId: number, userId?: number) {
    let statem = ``;
    const arr = [projectId];
    if (userId) {
      statem = `AND groupUserId=?`;
      arr.push(userId);
    }
    const statement = `DELETE FROM \`group\` WHERE groupProjectId=? ${statem};`;
    return this.groupRepository.query(statement, arr);
  }

  joinProject(projectId: number, userId: number, power: number) {
    const statement = `INSERT INTO \`group\` ( groupProjectId, groupUserId, groupUserPower )
    VALUES
      (?,?,?);`;
    return this.groupRepository.query(statement, [projectId, userId, power]);
  }
}
