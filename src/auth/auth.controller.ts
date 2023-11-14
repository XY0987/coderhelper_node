import { UserService } from './../user/user.service';
import { RedisService } from './../redis/redis.service';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { EmailService } from './../email/email.service';
import { AuthService } from './auth.service';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { EditPasswordDto, SignInDto, SignUpDto } from './auth.dto';
import { encipherPassword } from 'src/utils/md5Password';
import { JwtService } from '@nestjs/jwt';
import { getErrorResTo } from '../error/authError';

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
  @ApiOperation({ summary: '登录' })
  async signin(@Body() dto: SignInDto) {
    const { userEmail, password } = dto;
    const emailReg =
      /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    if (!emailReg.test(userEmail)) {
      return getErrorResTo(-1001);
    }
    const res = await this.authService.signin(
      userEmail,
      encipherPassword(password),
    );
    if (res.length == 0) {
      return getErrorResTo(-1004);
    }
    return {
      code: 200,
      token: await this.jwt.signAsync({
        userEmail: userEmail,
        userId: res[0].userId,
      }),
      info: '登录成功',
      message: '登录成功',
    };
  }

  // 注册
  @Post('/signup')
  @ApiOperation({ summary: '注册' })
  async signup(@Body() dto: SignUpDto) {
    const { userEmail, code, password } = dto;
    const emailReg =
      /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    if (!emailReg.test(userEmail)) {
      return getErrorResTo(-1001);
    }
    // 判断验证码对不对
    const res = await this.redisService.hGetAll(
      `coderhelper-emailCode:${userEmail}`,
    );
    console.log('res', res);

    if (!res || res[userEmail] != code || !code) {
      return getErrorResTo(-1002);
    }
    // 判断用户是否注册过
    const user = await this.userService.getUserInfoByEmail(userEmail);
    if (user.length > 0) {
      return getErrorResTo(-1003);
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
      message: '注册成功',
    };
  }
  @Get('/getCode')
  @ApiOperation({ summary: '获取验证码' })
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
      return getErrorResTo(-1001);
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
      return getErrorResTo(500, error);
    }
  }

  @Post('/editPassword')
  @ApiOperation({ summary: '修改密码' })
  async editPassword(@Body() dto: EditPasswordDto) {
    const { userEmail, code, password } = dto;
    const emailReg =
      /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    if (!emailReg.test(userEmail)) {
      return getErrorResTo(-1001);
    }
    // 判断验证码对不对
    const res = await this.redisService.hGetAll(
      `coderhelper-emailCode:${userEmail}`,
    );
    console.log('res', res);

    if (!res || res[userEmail] != code || !code) {
      return getErrorResTo(-1002);
    }
    // 判断用户是否注册过
    const user = await this.userService.getUserInfoByEmail(userEmail);
    if (user.length === 0) {
      return getErrorResTo(-1005);
    }
    // 更改密码
    const editPasswordRes = await this.userService.editPassword(
      userEmail,
      encipherPassword(password),
    );
    return {
      code: 200,
      info: '修改成功',
      message: '修改成功',
      data: editPasswordRes,
    };
  }
}
