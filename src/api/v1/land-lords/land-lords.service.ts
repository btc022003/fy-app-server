import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { beforeTwoWeeks } from 'src/utils/tools';
import {
  createContract,
  CreateHouseDto,
  CreateHouseRoomDto,
} from './dto/create-land-lord.dto';
import { encodePwd, validateCaptchaIsOutDated } from 'src/utils/tools';

@Injectable()
export class LandLordsService {
  constructor(private prisma: PrismaService) {}
  /**
   * 创建房源
   * @param landLordId
   * @param houseDto
   * @returns
   */
  async createHouse(landLordId: string, houseDto: CreateHouseDto) {
    await this.prisma.house.create({
      data: {
        region: houseDto.region,
        street: houseDto.street,
        community: houseDto.community,
        dwelling: houseDto.dwelling,
        address: houseDto.address,
        isWhole: houseDto.isWhole,
        landLordId,
        images: houseDto.images,
      },
    });
    return '创建房源成功';
  }

  /**
   * 修改房源信息
   * @param houseId
   * @param houseDto
   * @returns
   */
  async updateHouse(houseId: string, houseDto: CreateHouseDto) {
    await this.prisma.house.update({
      data: {
        region: houseDto.region,
        street: houseDto.street,
        community: houseDto.community,
        dwelling: houseDto.dwelling,
        address: houseDto.address,
        isWhole: houseDto.isWhole,
        images: houseDto.images,
      },
      where: {
        id: houseId,
      },
    });
    return '创建房源成功';
  }

  /**
   * 创建房间信息成功
   * @param houseId
   * @param houseRoom
   * @returns
   */
  async createHouseRoom(houseId: string, houseRoom: CreateHouseRoomDto) {
    const room = await this.prisma.room.create({
      data: {
        houseId,
        price: houseRoom.price,
        images: houseRoom.images,
        content: houseRoom.content,
      },
    });
    const devices = houseRoom.devices.split(',').map((item) => ({
      roomDeviceId: item,
      roomId: room.id,
    }));
    // 创建房间的设施
    await this.prisma.roomAndDevice.createMany({
      data: devices,
    });
    return '房间信息创建成功';
  }

  /**
   * 修改房间信息
   * @param roomId
   * @param houseRoom
   */
  async updateHouseRoom(roomId: string, houseRoom: CreateHouseRoomDto) {
    //
    await this.prisma.room.update({
      data: {
        price: houseRoom.price,
        images: houseRoom.images,
        content: houseRoom.content,
      },
      where: {
        id: roomId,
      },
    });
    // 删除原有的房屋设置
    await this.prisma.roomAndDevice.deleteMany({
      where: {
        roomId,
      },
    });
    const devices = houseRoom.devices.split(',').map((item) => ({
      roomDeviceId: item,
      roomId,
    }));
    // 创建房间的设施
    await this.prisma.roomAndDevice.createMany({
      data: devices,
    });
    return '房间信息创建成功';
  }

  /**
   * 根据id删除房间信息
   * @param roomId
   * @returns
   */
  async deleteHouseRoom(roomId: string) {
    await this.prisma.room.delete({
      where: {
        id: roomId,
      },
    });
    return '删除房间信息成功';
  }

  /**
   * 获取房源信息
   * @param id
   * @returns
   */
  findAll(id: string) {
    return this.prisma.house.findMany({
      where: {
        landLordId: id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * 获取房源信息
   * @param id
   * @returns
   */
  findHouseById(id: string) {
    return this.prisma.house.findFirst({
      where: {
        id,
      },
      include: {
        rooms: {
          include: {
            roomAndDevices: {
              include: {
                device: true,
              },
            },
            roomContracts: {
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
        },
      },
    });
  }

  /**
   * 获取房间信息
   * @param id
   * @returns
   */
  findHouseRoomById(id: string) {
    return this.prisma.room.findFirst({
      where: {
        id,
      },
      include: {
        house: true,
        roomAndDevices: {
          include: {
            device: true,
          },
        },
        dateRooms: true,
      },
    });
  }

  /**
   * 删除房源数据,设置下线，暂时为非物理删除
   * @param id
   * @returns
   */
  async remove(id: string) {
    await this.prisma.house.update({
      where: {
        id,
      },
      data: {
        offline: true,
      },
    });
    return '删除房源数据成功';
  }

  /**
   * 房东首页信息
   * @param userId
   * @returns
   */
  async homeInfo(landLordId: string) {
    //
    // 空房
    const emptyRoomCount = await this.prisma.room.count({
      where: {
        house: {
          landLordId: landLordId,
          offline: false,
        },
        isFull: false,
      },
    });
    // 已经出租
    const fullRoomCount = await this.prisma.room.count({
      where: {
        house: {
          landLordId: landLordId,
          offline: false,
        },
        isFull: true,
      },
    });
    // 待确认合同
    const needCheckedContract = await this.prisma.roomContract.findMany({
      where: {
        isChecked: false,
        landLordId: landLordId,
      },
      include: {
        user: true,
        landLord: true,
        room: {
          include: {
            house: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    const contracts = await this.prisma.roomContract.findMany({
      where: {
        landLordId,
      },
      select: {
        id: true,
      },
    });
    // console.log(contracts.map((item) => item.id));
    // 待收租金
    const needPayedContract = await this.prisma.roomContractOrder.findMany({
      where: {
        lastPayDate: {
          lte: beforeTwoWeeks().toDate(),
        },
        roomContractId: {
          in: contracts.map((item) => item.id),
        },
        isPayed: false,
      },
      include: {
        roomContract: {
          include: {
            user: true,
            landLord: true,
            room: {
              include: {
                house: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return {
      emptyRoomCount,
      fullRoomCount,
      needCheckedContract,
      needPayedContract,
    };
  }

  /**
   * 房源查询
   * @param landLordId
   * @param isWhole
   * @param minPrice
   * @param maxPrice
   * @param area
   * @returns
   */
  async houses(
    landLordId: string,
    isWhole: boolean = null,
    minPrice = -1,
    maxPrice = -1,
    area = '',
  ) {
    const filterClause: any = {};
    if (area) {
      filterClause.dwelling.contains = area;
    }

    const priceClause: any = {};

    if (minPrice > -1 && maxPrice > -1) {
      // filterClause.
      priceClause.get = minPrice;
      priceClause.lte = maxPrice;
    }
    const where: any = {
      landLordId: landLordId,
      offline: false,
    };
    if (isWhole != null) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      where.isWhole = { equals: isWhole == 'true' ? true : false };
    }
    const houses = await this.prisma.house.findMany({
      where,

      include: {
        rooms: {
          where: priceClause,
          include: {
            roomContracts: {
              include: {
                user: true,
                landLord: true,
              },
            },
            roomAndDevices: {
              include: {
                device: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return houses;
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
  async landLordSetIdNum(
    userId: string,
    idNum: string,
    realName: string,
    avatar: string,
  ) {
    await this.prisma.landLord.update({
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
   * 生成租房合同
   * @param data
   */
  async createContract(
    landLordId: string,
    userMobile: string,
    data: createContract,
  ) {
    const room = await this.prisma.room.findFirst({
      where: {
        id: data.roomId,
      },
      include: {
        house: true,
      },
    });
    // 已经租住的房子不能重复签订合同
    if (room.isFull) {
      return {
        success: false,
        errorMessage: '已经租住的房子不能重复签订合同',
      };
    }
    const user = await this.prisma.user.findFirst({
      where: {
        userName: userMobile,
      },
    });
    if (user) {
      await this.prisma.roomContract.create({
        data: {
          ...data,
          landLordId,
          userId: user.id,
          startTime: new Date(data.startTime),
          endTime: new Date(data.endTime),
        },
      });
      // 修改当前房间状态
      await this.prisma.room.update({
        where: {
          id: data.roomId,
        },
        data: {
          isFull: true,
        },
      });

      return {
        success: true,
        errorMessage: '合同签订成功',
      };
    } else {
      return {
        success: false,
        errorMessage: '用户手机号码不存在，请先注册',
      };
    }
  }

  /**
   * 获取合同信息
   * @param id
   * @returns
   */
  loadContractInfo(id: string) {
    return this.prisma.roomContract.findFirst({
      where: {
        id,
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
        user: true,
      },
    });
  }

  /**
   * 终止合同
   * @param id      合同id
   * @param llId    房东id
   * @returns
   */
  async cancelContract(id: string, llId: string) {
    const contract = await this.prisma.roomContract.findFirst({
      where: {
        landLordId: llId,
        id,
      },
    });
    if (contract) {
      if (contract.isChecked) {
        return {
          success: false,
          errorMessage: '执行中的合同无法终止',
        };
      } else {
        await this.prisma.roomContract.delete({
          where: {
            id,
          },
        });
        await this.prisma.room.update({
          where: {
            id: contract.roomId,
          },
          data: {
            isFull: false,
          },
        });
        return '合同终止成功';
      }
    } else {
      return {
        success: false,
        errorMessage: '合同信息不存在',
      };
    }
    // return null;
  }

  /**
   * 获取房东的个人信息
   * @param id
   * @returns
   */
  loadLandLordInfo(id: string) {
    return this.prisma.landLord.findFirst({
      where: {
        id,
      },
    });
  }

  /**
   * 获取有聊天记录的用户
   * @param id
   * @returns
   */
  loadHasMessageUsers(id: string) {
    return this.prisma.message.findMany({
      where: {
        landLordId: id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: true,
      },
      distinct: 'userId',
    });
  }

  /**
   * 获取当前80条聊天记录
   * @param llId
   * @param userId
   * @returns
   */
  async loadMessageList(llId: string, userId: string) {
    const data = await this.prisma.message.findMany({
      where: {
        landLordId: llId,
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 80,
    });
    return data;
  }

  /**
   * 获取报修信息
   * @param llId
   * @returns
   */
  loadRepairs(llId: string) {
    return this.prisma.roomRepair.findMany({
      where: {
        roomContract: {
          landLordId: llId,
        },
      },
      include: {
        roomContract: {
          include: {
            room: {
              include: {
                house: true,
              },
            },
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * 回复报修信息
   * @param id
   * @param content
   * @param images
   * @returns
   */
  replayRepairs(id: string, content: string, images: string) {
    return this.prisma.roomRepair.update({
      where: {
        id,
      },
      data: {
        replyContent: content,
        replyImage: images,
        isReplyed: true,
      },
    });
  }

  /**
   * 获取自己被预约的房源信息
   * @param llId
   * @returns
   */
  loadDates(llId: string) {
    return this.prisma.dateRoom.findMany({
      where: {
        room: {
          house: {
            landLordId: llId,
          },
        },
      },
      include: {
        user: true,
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
   * 获取投诉信息
   * @param llId
   * @returns
   */
  loadComplains(llId: string) {
    return this.prisma.complain.findMany({
      where: {
        contract: {
          room: {
            house: {
              landLordId: llId,
            },
          },
        },
      },
      include: {
        user: true,
        contract: {
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
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
