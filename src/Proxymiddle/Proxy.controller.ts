import { Controller, Get, Post, Put, Delete } from '@nestjs/common';

@Controller('dynamic-proxy')
export class ProxyController {
  @Get()
  getIndex() {
    return '你好';
  }
  @Post()
  getPost() {
    return '你好';
  }
  @Put()
  getPut() {}
  @Delete()
  getdelete() {}
}
