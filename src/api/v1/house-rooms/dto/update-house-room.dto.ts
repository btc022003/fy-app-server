import { PartialType } from '@nestjs/swagger';
import { CreateHouseRoomDto } from './create-house-room.dto';

export class UpdateHouseRoomDto extends PartialType(CreateHouseRoomDto) {}
