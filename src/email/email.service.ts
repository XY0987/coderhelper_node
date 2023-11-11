import { RedisService } from './../redis/redis.service';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
const nodemailer = require('nodemailer');

@Injectable()
export class EmailService {
  transporter: any;
  key: string;
  constructor(
    private configService: ConfigService,
    private redisService: RedisService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.qq.com' /*
            发送方用的是哪一个邮箱比如qq,可以在node_modules/nodemailer/lib/well-known/services.json里边找 */,
      port: 465, //端口号
      secure: true, // 端口号是465时写true,否则写false
      auth: {
        user: `${configService.get('SEND_EMAIL')}`, // 发送方的邮箱地址
        pass: `${configService.get('AUTH_EMAIL')}`, // mtp的验证码
      },
    });
    this.key = 'coderhelper-emailCode:';
  }
  sendEmail(email) {
    const code = Array.from({ length: 4 }, () =>
      Math.floor(Math.random() * 10),
    ).join('');
    this.redisService.hSet(`${this.key}${email}`, email, code, 300);
    let mailObj = {
      from: `"Fred Foo ?" <${this.configService.get('SEND_EMAIL')}>`, // 发送方的邮箱
      to: email, // 发送给谁(发送一个或多个,多个用逗号隔开)
      subject: '夜星', // 标题
      text: `您的验证码是:${code},有效期是5分钟`, // 发送的文本信息(只能输文本),文本信息和网页信息只能有一个
      // html: '<b>Hello world?</b>' // 发送的html页面
    };
    return new Promise((resolve, resject) => {
      this.transporter.sendMail(mailObj, (err, data) => {
        if (err) {
          resject('发送失败');
          return;
        }
        resolve('发送成功');
      });
    });
  }
}
