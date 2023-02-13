import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
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

  async checkContract(userId: string, contractId) {
    const contract = await this.prisma.roomContract.findFirst({
      where: {
        userId,
        id: contractId,
      },
    });

    if (contract) {
      if (contract.isChecked) {
        return {
          success: false,
          errorMessage: '不能重复确认合同',
        };
      }
      // 租客确认合同
      await this.prisma.roomContract.update({
        where: {
          id: contract.id,
        },
        data: {
          isChecked: true,
        },
      });

      // 生成支付订单
      const orders = [];
      // console.log(contract.endTime);
      const months = dayjs(contract.endTime).diff(
        dayjs(contract.startTime),
        'month',
      );
      for (let i = 0; i < months; i++) {
        orders.push({
          price: contract.price,
          lastPayDate: dayjs(contract.startTime)
            .add(i + 1, 'month')
            .toDate(),
        });
      }

      await this.prisma.roomContractOrder.createMany({
        data: orders,
      });
      return {
        success: true,
        errorMessage: '合同签订成功',
      };
    } else {
      return {
        success: false,
        errorMessage: '合同信息不存在',
      };
    }
  }

  /**
   * 获取个人信息
   * @param id
   * @returns
   */
  loadUserInfo(id: string) {
    return this.prisma.user.findFirst({
      where: {
        id,
      },
    });
  }
}
