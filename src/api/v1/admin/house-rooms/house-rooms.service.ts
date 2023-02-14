import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateHouseRoomDto } from './dto/create-house-room.dto';
import { UpdateHouseRoomDto } from './dto/update-house-room.dto';

@Injectable()
export class HouseRoomsService {
  constructor(private prisma: PrismaService) {}
  // create(createHouseRoomDto: CreateHouseRoomDto) {
  //   return 'This action adds a new houseRoom';
  // }

  async findAll(where = {}, page = 1, per = 10) {
    page = isNaN(page) ? 1 : page * 1;
    per = isNaN(per) ? 10 : per * 1;

    const list = await this.prisma.room.findMany({
      where,
      skip: (page - 1) * per,
      take: per * 1,
      include: {
        house: {
          include: {
            landLord: true,
          },
        },
      },
      // include,
      orderBy: {
        createdAt: 'desc',
      },
    });
    const total = await this.prisma.room.count({ where });
    return {
      list,
      current: page,
      pageSize: per,
      total,
    };
  }
  // findOne(id: number) {
  //   return `This action returns a #${id} houseRoom`;
  // }

  // update(id: number, updateHouseRoomDto: UpdateHouseRoomDto) {
  //   return `This action updates a #${id} houseRoom`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} houseRoom`;
  // }
}
