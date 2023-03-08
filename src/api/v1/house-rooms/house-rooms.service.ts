import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateHouseRoomDto } from './dto/create-house-room.dto';
import { UpdateHouseRoomDto } from './dto/update-house-room.dto';

@Injectable()
export class HouseRoomsService {
  constructor(private prisma: PrismaService) {}

  async findAll(where = {}, page = 1, per = 10, userId = '') {
    page = isNaN(page) ? 1 : page * 1;
    per = isNaN(per) ? 10 : per * 1;

    const list = await this.prisma.room.findMany({
      where,
      skip: (page - 1) * per,
      take: per * 1,
      // include,
      include: {
        house: true,
        // roomAndDevices: {
        //   include: {
        //     device: true,
        //   },
        // },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    console.log(list.length, per);
    const total = await this.prisma.room.count({ where });
    let collections: string[] = [];
    if (userId) {
      collections = (
        await this.prisma.roomCollection.findMany({
          where: {
            userId,
          },
          select: {
            roomId: true,
          },
        })
      ).map((item) => item.roomId);
    }
    // console.log(userId);
    return {
      list: list.map((item) => ({
        ...item,
        isCollection: collections.includes(item.id),
      })),
      current: page,
      pageSize: per,
      total,
    };
  }

  // create(createHouseRoomDto: CreateHouseRoomDto) {
  //   return 'This action adds a new houseRoom';
  // }

  // findAll() {
  //   return `This action returns all houseRooms`;
  // }

  /**
   * 根据id查看房源详细信息
   * @param id  房源id
   * @param userId 用户id
   * @returns
   */
  async findOne(id: string, userId = '') {
    let collection = {};
    if (userId) {
      collection = await this.prisma.roomCollection.findFirst({
        where: {
          userId,
          roomId: id,
        },
      });
    }

    const room = await this.prisma.room.findFirst({
      where: {
        id,
      },
      include: {
        house: {
          include: {
            landLord: true,
          },
        },
        roomAndDevices: {
          include: {
            device: true,
          },
        },
      },
    });
    return { ...room, isCollection: collection ? true : false };
  }

  // update(id: number, updateHouseRoomDto: UpdateHouseRoomDto) {
  //   return `This action updates a #${id} houseRoom`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} houseRoom`;
  // }
}
