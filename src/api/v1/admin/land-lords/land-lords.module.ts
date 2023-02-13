import { Module } from '@nestjs/common';
import { LandLordsService } from './land-lords.service';
import { LandLordsController } from './land-lords.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [LandLordsController],
  providers: [LandLordsService, PrismaService],
})
export class LandLordsModule {}
