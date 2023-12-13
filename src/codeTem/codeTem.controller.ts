import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CodeTemService } from './codeTem.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateCodeTemDto, EditCodeTemDto } from './codeTem.dot';
import { getErrorResCodeTem } from 'src/error/codeTemError';

@Controller('CodeTem')
@UseGuards(AuthGuard('jwt'))
@ApiTags('代码片段')
@ApiBearerAuth()
export class CodeTemController {
  constructor(private readonly codeTemService: CodeTemService) {}

  @Post('/create')
  @ApiOperation({ summary: '添加代码片段' })
  async create(@Body() dto: CreateCodeTemDto, @Req() req) {
    const userId = req.user.userId;
    const { codeStr, codeType, codeTheme, codeDesc } = dto;
    const res = await this.codeTemService.create(
      codeStr,
      codeType,
      userId,
      codeTheme,
      codeDesc,
    );
    return {
      code: 200,
      message: '创建成功',
      data: res,
    };
  }

  @Delete('/delete')
  @ApiOperation({ summary: '删除代码片段' })
  @ApiQuery({
    name: 'codeId',
    type: 'number',
    description: '要删除的代码片段的id',
  })
  async delete(@Query() { codeId }: { codeId: number }, @Req() req) {
    const userId = req.user.userId;
    // 查找是不是当前用户创建的
    const res = await this.codeTemService.getCodeBycodeIdAndUserId(
      codeId,
      userId,
    );
    if (res.length <= 0) {
      return getErrorResCodeTem(-6001);
    }
    // 删除
    const delRes = await this.codeTemService.delCode(codeId);
    return {
      code: 200,
      message: '删除成功',
      data: delRes,
    };
  }

  // 根据类型查找对应代码片段
  @Get('/getCodeTem')
  @ApiOperation({ summary: '获取指定类型的代码片段' })
  @ApiQuery({
    name: 'codeType',
    type: 'string',
    description: '代码片段的类型',
  })
  async getCodeTem(@Query() { type }: { type: string }) {
    const res = await this.codeTemService.getCodeTem(type);
    return {
      code: 200,
      data: res,
    };
  }

  // 修改代码片段
  @Post('/editCodeTem')
  @ApiOperation({ summary: '编辑代码片段' })
  async editCodeTem(@Body() dto: EditCodeTemDto, @Req() req) {
    const { codeId, codeStr, codeDesc, codeTheme, codeType } = dto;
    const userId = req.user.userId;
    // 查找是不是当前用户创建的
    const res = await this.codeTemService.getCodeBycodeIdAndUserId(
      codeId,
      userId,
    );
    if (res.length <= 0) {
      return getErrorResCodeTem(-6001);
    }
    // 修改
    const editRes = await this.codeTemService.editCodeTem(
      codeStr,
      codeDesc,
      codeTheme,
      codeType,
      codeId,
    );
    return {
      code: 200,
      data: editRes,
    };
  }
}
