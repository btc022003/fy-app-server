import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as dayjs from 'dayjs';
import { generateCaptcha } from 'src/utils/tools';

@Injectable()
export class CommonService {
  constructor(private readonly prisma: PrismaService) {}

  async sendSms(mobile: string, code: string) {
    console.log('短信发送成功');
    /**
     * 调用短信接口部分需要实现
     */
    await this.prisma.captcha.create({
      data: {
        mobile,
        code,
      },
    });
  }

  /**
   * 获取验证码
   * @param mobile
   * @param purpose
   * @param remarks
   * @returns
   */
  async generateCaptcha(mobile: string, purpose = 'reg', remarks = '登陆') {
    //
    const code = generateCaptcha();
    const captcha = await this.prisma.captcha.findFirst({
      where: {
        mobile,
        remarks,
        purpose,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // console.log(captcha);
    if (captcha) {
      // console.log(dayjs().diff(dayjs(captcha.createdAt), 's'));
      if (dayjs().diff(dayjs(captcha.createdAt), 's') < 200) {
        return '请勿重复获取验证码';
      } else {
        // 发送短信
        this.sendSms(mobile, code);
        return code;
      }
    } else {
      // 发送短信
      this.sendSms(mobile, code);
      return code;
    }
  }
}
