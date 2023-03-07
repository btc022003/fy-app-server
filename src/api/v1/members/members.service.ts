import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { encodePwd, validateCaptchaIsOutDated } from 'src/utils/tools';
import { DateHouseRoom } from './dto/create-member.dto';

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
          roomContractId: contract.id,
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

  /**
   * 预约看房
   * @param userId
   * @param roomId
   * @param dateTime
   * @param remarks
   * @returns
   */
  dateHouseRoom(dateRoom: DateHouseRoom) {
    return this.prisma.dateRoom.create({
      data: {
        roomId: dateRoom.userId,
        userId: dateRoom.roomId,
        dateTime: new Date(dateRoom.dateTime),
        remarks: dateRoom.remarks,
      },
    });
  }

  /**
   * 报修信息
   * @param userId
   * @param askImage
   * @param remarks
   * @param roomContractId
   * @returns
   */
  async repairsOrder(userId, askImage, remarks) {
    // const roomContractId = '';
    // 获取用户的最新合同信息
    const contract = await this.prisma.roomContract.findFirst({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    if (contract) {
      return {
        success: false,
        errorMessage: '合同信息不存在',
      };
    } else {
      return this.prisma.roomRepair.create({
        //
        data: {
          userId,
          askImage,
          remarks,
          roomContractId: contract.id,
        },
      });
    }
  }

  /**
   * 对合同信息进行投诉
   * @param userId
   * @param askImage
   * @param remarks
   * @returns
   */
  async complain(userId, askImage, remarks) {
    const contract = await this.prisma.roomContract.findFirst({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    if (contract) {
      return {
        success: false,
        errorMessage: '合同信息不存在',
      };
    } else {
      return this.prisma.complain.create({
        //
        data: {
          userId,
          askImage,
          remarks,
          roomContractId: contract.id,
        },
      });
    }
  }

  /**
   * 取消或者加入收藏
   * @param userId
   * @param roomId
   * @param remarks
   */
  async toggleFav(userId: string, roomId: string, remarks = '') {
    const collection = await this.prisma.roomCollection.findFirst({
      where: {
        roomId,
        userId,
      },
    });
    // console.log(collection);
    if (collection) {
      await this.prisma.roomCollection.delete({
        where: {
          id: (await collection).id,
        },
      });
    } else {
      await this.prisma.roomCollection.create({
        data: {
          userId,
          roomId,
          remarks,
        },
      });
    }
  }
}
