import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { encodePwd, validateCaptchaIsOutDated } from 'src/utils/tools';

@Injectable()
export class MembersService {
  constructor(private prisma: PrismaService) {}

  /**
   * 设置密码
   * @param userId
   * @param pwd
   */
  setPwd(userId: string, pwd: string) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: encodePwd(pwd),
      },
    });
  }

  /**
   * 重置密码
   * @param userId
   * @param pwd
   * @param code
   * @returns
   */
  async resetPwd(userId: string, pwd: string, code: string) {
    //
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
    });
    if (user) {
      // 验证时间
      const captcha = await this.prisma.captcha.findFirst({
        where: {
          mobile: user.userName,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      if (validateCaptchaIsOutDated(captcha.createdAt)) {
        if (captcha.code == code) {
          // 修改密码
          await this.prisma.user.update({
            where: {
              id: userId,
            },
            data: {
              password: encodePwd(pwd),
            },
          });
          return {
            success: true,
            errorMessage: '重置密码成功',
          };
        } else {
          return {
            success: false,
            errorMessage: '验证码已过期',
          };
        }
      } else {
        return {
          success: false,
          errorMessage: '验证码错误',
        };
      }
    } else {
      return {
        success: false,
        errorMessage: '用户信息异常',
      };
    }
  }

  /**
   * 设置实名信息
   * @param userId
   * @param idNum
   */
  async setIdNum(userId: string, idNum: string, realName: string) {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        idNum,
        realName,
      },
    });
    return '实名信息修改成功';
  }

  /**
   * 设置密码
   * @param userId
   * @param pwd
   */
  landLordSetPwd(userId: string, pwd: string) {
    return this.prisma.landLord.update({
      where: {
        id: userId,
      },
      data: {
        password: encodePwd(pwd),
      },
    });
  }

  /**
   * 重置密码
   * @param userId
   * @param pwd
   * @param code
   * @returns
   */
  async landLordResetPwd(userId: string, pwd: string, code: string) {
    //
    const user = await this.prisma.landLord.findFirst({
      where: {
        id: userId,
      },
    });
    if (user) {
      // 验证时间
      const captcha = await this.prisma.captcha.findFirst({
        where: {
          mobile: user.userName,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      if (validateCaptchaIsOutDated(captcha.createdAt)) {
        if (captcha.code == code) {
          // 修改密码
          await this.prisma.landLord.update({
            where: {
              id: userId,
            },
            data: {
              password: encodePwd(pwd),
            },
          });
          return {
            success: true,
            errorMessage: '重置密码成功',
          };
        } else {
          return {
            success: false,
            errorMessage: '验证码已过期',
          };
        }
      } else {
        return {
          success: false,
          errorMessage: '验证码错误',
        };
      }
    } else {
      return {
        success: false,
        errorMessage: '用户信息异常',
      };
    }
  }

  /**
   * 设置实名信息
   * @param userId
   * @param idNum
   */
  async landLordSetIdNum(userId: string, idNum: string, realName: string) {
    await this.prisma.landLord.update({
      where: {
        id: userId,
      },
      data: {
        idNum,
        realName,
      },
    });
    return '实名信息修改成功';
  }
}
