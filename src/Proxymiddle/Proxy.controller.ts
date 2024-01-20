import { Controller, Get, Post, Put, Delete } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('dynamic-proxy')
@ApiTags('代理')
export class ProxyController {
  @Get()
  @ApiOperation({ summary: 'get代理' })
  getIndex() {
    return '你好';
  }
  @Post()
  @ApiOperation({ summary: 'Post代理' })
  getPost() {
    return '你好';
  }
  @Put()
  @ApiOperation({ summary: 'Put代理' })
  getPut() {
    return '你好';
  }
  @Delete()
  @ApiOperation({ summary: 'delete代理' })
  getdelete() {
    return '你好';
  }
}
