import { Module } from '@nestjs/common';
import { HouseRoomsService } from './house-rooms.service';
import { HouseRoomsController } from './house-rooms.controller';

@Module({
  controllers: [HouseRoomsController],
  providers: [HouseRoomsService]
})
export class HouseRoomsModule {}
