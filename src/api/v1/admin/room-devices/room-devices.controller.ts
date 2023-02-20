import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/api/base/base.controller';
import { RoomDevicesService } from './room-devices.service';

@ApiTags('平台端-设备管理')
@Controller('/api/v1/admin/room_devices')
export class RoomDevicesController extends BaseController {
  constructor(private readonly roomDevicesService: RoomDevicesService) {
    super(roomDevicesService);
  }
}
