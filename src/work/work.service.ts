import { Injectable } from '@nestjs/common';
import { Work } from './work.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class WorkService {
  constructor(
    @InjectRepository(Work)
    private readonly projectRepository: Repository<Work>,
  ) {}

  create(
    workProjectId: number,
    workName: string,
    workDesc: string,
    workUserId: number,
    workCreateTime: string,
    workEndTime: string,
    workStatus: number,
    workRaiseUserId: number,
    workVexation: number,
    workType: number,
  ) {
    const statement = `INSERT INTO \`work\` (
        workProjectId,
        workName,
        workDesc,
        workUserId,
        workCreateTime,
        workEndTime,
        workStatus,
        workRaiseUserId,
        workVexation,
    workType) VALUES (?,?,?,?,?,?,?,?,?,?);`;
    return this.projectRepository.query(statement, [
      workProjectId,
      workName,
      workDesc,
      workUserId,
      workCreateTime,
      workEndTime,
      workStatus,
      workRaiseUserId,
      workVexation,
      workType,
    ]);
  }

  getWrokByProjectId(
    workProjectId: number,
    beginIndex: number,
    size: number,
    workStatus?: number,
  ) {
    let str = ``;
    const arr = [workProjectId];
    if (workStatus && workStatus != 0) {
      str = `AND workStatus=? `;
      arr.push(workStatus);
    }
    arr.push(Number(size));
    arr.push((beginIndex - 1) * size);
    const statement = `SELECT * FROM \`work\` LEFT JOIN \`user\` ON workUserId=userId WHERE  workProjectId=? ${str} LIMIT ? OFFSET ?;`;
    return this.projectRepository.query(statement, arr);
  }

  // 删除work
  delWork(workId: number) {
    const statement = `DELETE FROM \`work\` WHERE workId=?;`;
    return this.projectRepository.query(statement, [workId]);
  }
}
