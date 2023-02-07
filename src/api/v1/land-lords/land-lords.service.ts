import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { beforeTwoWeeks } from 'src/utils/tools';
import { CreateHouseDto, CreateHouseRoomDto } from './dto/create-land-lord.dto';

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

  findAll() {
    return `This action returns all landLords`;
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
    // 待收租金
    const needPayedContract = await this.prisma.roomContractOrder.findMany({
      where: {
        lastPayDate: {
          lte: beforeTwoWeeks().toString(),
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
    isWhole: boolean,
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
    const houses = await this.prisma.house.findMany({
      where: {
        isWhole,
        landLordId: landLordId,
        offline: false,
      },
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
}
