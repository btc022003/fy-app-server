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
  async setIdNum(
    userId: string,
    idNum: string,
    realName: string,
    avatar: string,
  ) {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        idNum,
        realName,
        avatar,
      },
    });
    return '实名信息修改成功';
  }

  /**
   * 获取当前用户的合同信息
   * @param userId
   * @returns
   */
  async loadUserContract(userId: string) {
    const contract = await this.prisma.roomContract.findFirst({
      where: {
        userId,
      },
      include: {
        room: {
          include: {
            house: true,
            roomAndDevices: {
              include: {
                device: true,
              },
            },
          },
        },
        landLord: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    if (contract) {
      return contract;
    } else {
      return {
        success: false,
        errorMessage: '暂无合同',
      };
    }
  }

  /**
   * 确认合同
   * @param userId
   * @param contractId
   * @returns
   */
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
   * 加载当前用户的合同支付信息
   * @param id
   * @returns
   */
  loadOrders(id: string) {
    return this.prisma.roomContractOrder.findMany({
      where: {
        roomContractId: id,
      },
      // include: {
      //   roomContract: {
      //     include: {
      //       user: true,
      //       landLord: true,
      //       room: {
      //         include: {
      //           house: true,
      //           roomAndDevices: {
      //             include: {
      //               device: true,
      //             },
      //           },
      //         },
      //       },
      //     },
      //   },
      // },
    });
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
        roomId: dateRoom.roomId,
        userId: dateRoom.userId,
        dateTime: new Date(dateRoom.dateTime),
        remarks: dateRoom.remarks,
      },
    });
  }

  /**
   * 获取指定用户的所有预约看房记录
   * @param userId
   * @returns
   */
  loadDateHouseRooms(userId: string) {
    return this.prisma.dateRoom.findMany({
      where: {
        userId,
      },
      include: {
        room: {
          include: {
            house: {
              include: {
                landLord: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
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
    // console.log(contract);
    if (contract) {
      return this.prisma.roomRepair.create({
        //
        data: {
          userId,
          askImage,
          remarks,
          roomContractId: contract.id,
        },
      });
    } else {
      return {
        success: false,
        errorMessage: '合同信息不存在',
      };
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
      return this.prisma.complain.create({
        //
        data: {
          userId,
          askImage,
          remarks,
          roomContractId: contract.id,
        },
      });
    } else {
      return {
        success: false,
        errorMessage: '合同信息不存在',
      };
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

  /**
   * 获取有聊天记录的用户
   * @param id
   * @returns
   */
  loadHasMessageUsers(id: string) {
    return this.prisma.message.findMany({
      where: {
        userId: id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        landLord: true,
      },
      distinct: 'landLordId',
    });
  }

  /**
   * 获取当前80条聊天记录
   * @param llId
   * @param userId
   * @returns
   */
  loadMessageList(llId: string, userId: string) {
    return this.prisma.message.findMany({
      where: {
        landLordId: llId,
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 80,
    });
  }

  async payContractOrder(id: string) {
    const co = await this.prisma.roomContractOrder.findFirst({
      where: { id },
      include: {
        roomContract: true,
      },
    });
    if (co) {
      if (co.isPayed) {
        return {
          success: false,
          errorMessage: '此次账单已支付',
        };
      } else {
        // 设置订单为已支付
        await this.prisma.roomContractOrder.update({
          where: {
            id,
          },
          data: {
            isPayed: true,
            payDate: new Date(),
          },
        });
      }
      // 添加资金往来记录
      await this.prisma.balanceLog.create({
        data: {
          category: 'add',
          data: co.price,
          remarks: '用户交房租:' + co.id,
          landLordId: co.roomContract.landLordId,
        },
      });
      // 修改账户余额数据
      await this.prisma.landLord.update({
        where: {
          id: co.roomContract.landLordId,
        },
        data: {
          balance: {
            increment: co.price,
          },
        },
      });
      return '支付成功';
    } else {
      return {
        success: false,
        errorMessage: '合同信息不存在',
      };
    }
  }
}
