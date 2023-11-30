import { UserService } from './../user/user.service';
import { RedisService } from './../redis/redis.service';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { EmailService } from './../email/email.service';
import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Get,
  Header,
  Post,
  Query,
  StreamableFile,
} from '@nestjs/common';
import { EditPasswordDto, SignInDto, SignUpDto } from './auth.dto';
import { encipherPassword } from 'src/utils/md5Password';
import { JwtService } from '@nestjs/jwt';
import { getErrorResTo } from '../error/authError';
import { createReadStream } from 'fs';
import { join } from 'path';

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

  @Get('/test')
  @ApiOperation({ summary: '测试监听键值过期' })
  @ApiQuery({
    name: 'time',
    type: 'number',
    description: '测试监听键值过期，在time秒后进行消息提醒',
  })
  async setKey(@Query() { time }: { time: number }) {
    this.redisService.hSet(
      'key',
      'bar',
      '{"messageTitle":"消息主题","messageContent":"{\\"content\\":\\"消息内容\\",\\"workVexation\\":0,\\"workType\\":0,\\"workEndTime\\":\\"2023-11-29 08:00:11\\"}","messageToUserId":3,"messageType":0,"messageUserId":3,"messageProjectId":7}',
      time,
    );
    return {
      code: 200,
      message: '添加成功',
    };
  }
  @Get('/file')
  @Header('Content-Type', 'application/json')
  @Header('Content-Disposition', 'attachment; filename="reqct.d.ts"')
  getFile() {
    const file = createReadStream(join(process.cwd(), './src/file/react.d.ts'));
    return new StreamableFile(file);
  }
}
