import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CodeTem } from './codeTem.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CodeTemService {
  constructor(
    @InjectRepository(CodeTem)
    private readonly codeTemRepository: Repository<CodeTem>,
  ) {}

  create(codeStr: string, codeType: string, codeUserId: number) {
    const statement = `INSERT INTO code_tem ( codeStr, codeType, codeUserId )
    VALUES
        (?,?,?);`;
    return this.codeTemRepository.query(statement, [
      codeStr,
      codeType,
      codeUserId,
    ]);
  }

  // 根据用户id和codeId查找
  getCodeBycodeIdAndUserId(codeId: number, userId: number) {
    const statement = `SELECT
	* 
FROM
	code_tem 
WHERE
	codeUserId =? 
	AND codeId =?;`;
    return this.codeTemRepository.query(statement, [userId, codeId]);
  }

  delCode(codeId: number) {
    const statement = `DELETE 
    FROM
        code_tem 
    WHERE
        codeId =?;`;
    return this.codeTemRepository.query(statement, [codeId]);
  }
}
