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

  create(
    codeStr: string,
    codeType: string,
    codeUserId: number,
    codeTheme: string,
    codeDesc: string,
  ) {
    const statement = `INSERT INTO code_tem ( codeStr, codeType, codeUserId , codeTheme , codeDesc)
    VALUES
        (?,?,?,?,?);`;
    return this.codeTemRepository.query(statement, [
      codeStr,
      codeType,
      codeUserId,
      codeTheme,
      codeDesc,
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

  getCodeTem(type: string) {
    const statement = `SELECT
    * 
  FROM
    code_tem 
  WHERE
    codeType =?;`;
    return this.codeTemRepository.query(statement, [type]);
  }

  editCodeTem(
    codeStr: string,
    codeDesc: string,
    codeTheme: string,
    codeType: string,
    codeId: number,
  ) {
    const statement = `UPDATE code_tem 
    SET codeStr =?,
    codeDesc =?,
    codeTheme =?,
    codeType =? 
    WHERE
      codeId =?;`;
    return this.codeTemRepository.query(statement, [
      codeStr,
      codeDesc,
      codeTheme,
      codeType,
      codeId,
    ]);
  }
}
