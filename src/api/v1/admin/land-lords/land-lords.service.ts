import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLandLordDto } from './dto/create-land-lord.dto';
import { UpdateLandLordDto } from './dto/update-land-lord.dto';

@Injectable()
export class LandLordsService {
  constructor(private prisma: PrismaService) {}

  async findAll(where = {}, page = 1, per = 10) {
    page = isNaN(page) ? 1 : page * 1;
    per = isNaN(per) ? 10 : per * 1;

    const list = await this.prisma.landLord.findMany({
      where,
      skip: (page - 1) * per,
      take: per * 1,
      // include,
      orderBy: {
        createdAt: 'desc',
      },
    });
    const total = await this.prisma.landLord.count({ where });
    return {
      list,
      current: page,
      pageSize: per,
      total,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} landLord`;
  }

  /**
   * 审核资质
   * @param id
   * @returns
   */
  async chkLandLord(id: string) {
    const ll = await this.prisma.landLord.findUnique({
      where: {
        id,
      },
    });
    return this.prisma.landLord.update({
      where: {
        id,
      },
      data: {
        isChecked: !ll.isChecked,
      },
    });
  }

  remove(id: string) {
    return this.prisma.landLord.delete({
      where: {
        id,
      },
    });
  }
}
