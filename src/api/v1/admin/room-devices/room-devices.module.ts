import { Module } from '@nestjs/common';
import { RoomDevicesService } from './room-devices.service';
import { RoomDevicesController } from './room-devices.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [RoomDevicesController],
  providers: [RoomDevicesService, PrismaService],
})
export class RoomDevicesModule {}
