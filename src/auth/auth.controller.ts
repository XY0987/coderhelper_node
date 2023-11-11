import { UserService } from './../user/user.service';
import { RedisService } from './../redis/redis.service';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { EmailService } from './../email/email.service';
import { AuthService } from './auth.service';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SignInDto, SignUpDto } from './auth.dto';
import { encipherPassword } from 'src/utils/md5Password';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
@ApiTags('登录注册') // 分组
export class AuthController {
  constructor(
    private authService: AuthService,
    private emailService: EmailService,
    private redisService: RedisService,
    private userService: UserService,
    private jwt: JwtService,
  ) {}

  @Post('/signin')
  async signin(@Body() dto: SignInDto) {
    const { userEmail, password } = dto;
    const emailReg =
      /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    if (!emailReg.test(userEmail)) {
      return {
        code: -10001,
        info: '邮箱错误',
        message: '请输入正确邮箱',
      };
    }
    const res = await this.authService.signin(
      userEmail,
      encipherPassword(password),
    );
    if (res.length == 0) {
      return {
        code: -1004,
        info: '账号或密码错误',
        message: '账号或密码错误，请重新输入',
      };
    }
    return {
      code: 200,
      token: await this.jwt.signAsync({
        userEmail: userEmail,
        userId: res[0].userId,
      }),
      info: '登录成功',
    };
  }

  // 注册
  @Post('/signup')
  async signup(@Body() dto: SignUpDto) {
    const { userEmail, code, password } = dto;
    const emailReg =
      /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    if (!emailReg.test(userEmail)) {
      return {
        code: -10001,
        info: '邮箱错误',
        message: '请输入正确邮箱',
      };
    }
    // 判断验证码对不对
    const res = await this.redisService.hGetAll(
      `coderhelper-emailCode:${userEmail}`,
    );
    console.log('res', res);

    if (!res || res[userEmail] != code || !code) {
      return {
        code: -10002,
        info: '验证码错误',
        message: '验证码错误或过期，请重新输入',
      };
    }
    // 判断用户是否注册过
    const user = await this.userService.getUserInfoByEmail(userEmail);
    if (user.length > 0) {
      return {
        code: -10003,
        info: '邮箱已注册过',
        message: '您已注册过，请直接登录',
      };
    }
    // 注册
    const creatRes = await this.authService.signup(
      userEmail,
      encipherPassword(password),
    );
    return {
      code: 200,
      data: creatRes,
      info: '注册成功',
    };
  }
  @Get('/getCode')
  @ApiQuery({
    name: 'userEmail',
    type: 'string',
    description: '邮箱',
  })
  async getCode(@Query() query: { userEmail: string }) {
    // 检验email是否规范
    const { userEmail } = query;
    const emailReg =
      /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    if (!emailReg.test(userEmail)) {
      return {
        code: -10001,
        info: '邮箱错误',
        message: '请输入正确邮箱',
      };
    }
    // 发送邮箱
    try {
      await this.emailService.sendEmail(userEmail);
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
