import { Injectable } from '@nestjs/common';
import { Work } from './work.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class WorkService {
  constructor(
    @InjectRepository(Work)
    private readonly workRepository: Repository<Work>,
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
    return this.workRepository.query(statement, [
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
    workVexation?: number,
    workType?: number,
  ) {
    let str = ``;
    const arr = [workProjectId];
    if (workStatus || workStatus == 0) {
      str = `AND workStatus=? `;
      arr.push(workStatus);
    }

    if (workVexation || workVexation == 0) {
      str += `AND workVexation=? `;
      arr.push(workVexation);
    }

    if (workType || workType == 0) {
      str += `AND workType=? `;
      arr.push(workType);
    }

    arr.push(Number(size));
    arr.push((beginIndex - 1) * size);
    const statement = `SELECT * FROM \`work\` LEFT JOIN \`user\` ON workUserId=userId WHERE  workProjectId=? ${str}LIMIT ? OFFSET ?;`;
    return this.workRepository.query(statement, arr);
  }
  getAllWrokByProjectId(
    workProjectId: number,
    workStatus?: number,
    workVexation?: number,
    workType?: number,
  ) {
    let str = ``;
    const arr = [workProjectId];
    if (workStatus || workStatus == 0) {
      str = `AND workStatus=? `;
      arr.push(workStatus);
    }

    if (workVexation || workVexation == 0) {
      str += `AND workVexation=? `;
      arr.push(workVexation);
    }

    if (workType || workType == 0) {
      str += `AND workType=? `;
      arr.push(workType);
    }
    const statement = `SELECT * FROM \`work\` LEFT JOIN \`user\` ON workUserId=userId WHERE  workProjectId=? ${str};`;
    return this.workRepository.query(statement, arr);
  }

  // 删除work
  delWork(workId: number) {
    const statement = `DELETE FROM \`work\` WHERE workId=?;`;
    return this.workRepository.query(statement, [workId]);
  }

  getUserWork(
    workProjectId: number,
    workStatus: number,
    workVexation: number,
    workType: number,
    workUserId: number,
  ) {
    let str = ``;
    const arr = [workProjectId];
    if (workStatus || workStatus == 0) {
      str = `AND workStatus=? `;
      arr.push(workStatus);
    }

    if (workVexation || workVexation == 0) {
      str += `AND workVexation=? `;
      arr.push(workVexation);
    }

    if (workType || workType == 0) {
      str += `AND workType=? `;
      arr.push(workType);
    }
    str += `AND workUserId=? `;
    arr.push(workUserId);
    const statement = `SELECT * FROM \`work\` LEFT JOIN \`user\` ON userId=workUserId WHERE workProjectId=? ${str};`;
    return this.workRepository.query(statement, arr);
  }

  getUserPublishWork(
    workProjectId: number,
    workStatus: number,
    workVexation: number,
    workType: number,
    workRaiseUserId: number,
  ) {
    let str = ``;
    const arr = [workProjectId];
    if (workStatus || workStatus == 0) {
      str = `AND workStatus=? `;
      arr.push(workStatus);
    }

    if (workVexation || workVexation == 0) {
      str += `AND workVexation=? `;
      arr.push(workVexation);
    }

    if (workType || workType == 0) {
      str += `AND workType=? `;
      arr.push(workType);
    }
    str += `AND workRaiseUserId=? `;
    arr.push(workRaiseUserId);
    const statement = `SELECT * FROM \`work\` LEFT JOIN \`user\` ON userId=workUserId WHERE workProjectId=? ${str};`;
    return this.workRepository.query(statement, arr);
  }

  // 修改work(未配置消息)
  editWork() {}
}
