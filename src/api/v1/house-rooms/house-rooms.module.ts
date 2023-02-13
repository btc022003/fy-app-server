import { Module } from '@nestjs/common';
import { HouseRoomsService } from './house-rooms.service';
import { HouseRoomsController } from './house-rooms.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [HouseRoomsController],
  providers: [HouseRoomsService, PrismaService],
})
export class HouseRoomsModule {}
