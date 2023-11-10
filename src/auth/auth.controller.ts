import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { EmailService } from './../email/email.service';
import { AuthService } from './auth.service';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SignInDto } from './auth.dto';

@Controller('auth')
@ApiTags('登录注册') // 分组
export class AuthController {
  constructor(
    private authService: AuthService,
    private emailService: EmailService,
  ) {}

  @Post('/sigin')
  async sigin(@Body() dto: SignInDto) {
    const { userEmail, password } = dto;
    const res = await this.authService.signin(userEmail, password);
    return res;
  }

  // 注册
  @Post('/singup')
  singup() {}
  @Get('/getCode')
  @ApiQuery({
    name: 'email',
    type: 'string',
    description: '邮箱',
  })
  async getCode(@Query() query: { email: string }) {
    // 检验email是否规范
    const { email } = query;
    const emailReg =
      /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    if (!emailReg.test(email)) {
      return {
        code: -10001,
        info: '邮箱错误',
        message: '请输入正确邮箱',
      };
    }
    // 发送邮箱
    try {
      await this.emailService.sendEmail(email);
      return {
        code: 200,
        info: '发送成功',
      };
    } catch (error) {
      console.log(error);
      return {
        code: 500,
        info: error,
        message: '未知错误，请稍后重试',
      };
    }
  }
}
