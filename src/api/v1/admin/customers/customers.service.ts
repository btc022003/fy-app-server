import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}
  // create(createCustomerDto: CreateCustomerDto) {
  //   return 'This action adds a new customer';
  // }

  async findAll(where = {}, page = 1, per = 10) {
    page = isNaN(page) ? 1 : page * 1;
    per = isNaN(per) ? 10 : per * 1;

    const list = await this.prisma.user.findMany({
      where,
      skip: (page - 1) * per,
      take: per * 1,
      // include,
      orderBy: {
        createdAt: 'desc',
      },
    });
    const total = await this.prisma.user.count({ where });
    return {
      list,
      current: page,
      pageSize: per,
      total,
    };
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} customer`;
  // }

  // update(id: number, updateCustomerDto: UpdateCustomerDto) {
  //   return `This action updates a #${id} customer`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} customer`;
  // }

  /**
   * 查看用户合同信息
   * @param userId
   * @returns
   */
  loadContractList(userId: string) {
    return this.prisma.roomContract.findMany({
      where: {
        userId,
      },
      include: {
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
  }

  /**
   * 查看预约看房记录
   * @param userId
   * @returns
   */
  loadDateList(userId: string) {
    return this.prisma.dateRoom.findMany({
      where: {
        userId,
      },
      include: {
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
  }
}
