import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/api/base/base.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BannerCategoriesService extends BaseService {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.bannerCategory);
  }
}
