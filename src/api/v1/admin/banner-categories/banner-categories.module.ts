import { Module } from '@nestjs/common';
import { BannerCategoriesService } from './banner-categories.service';
import { BannerCategoriesController } from './banner-categories.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [BannerCategoriesController],
  providers: [BannerCategoriesService, PrismaService],
})
export class BannerCategoriesModule {}
