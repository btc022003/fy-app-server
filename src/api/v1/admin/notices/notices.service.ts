import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/api/base/base.service';
import { PrismaService } from 'src/prisma/prisma.service';
// import { CreateNoticeDto } from './dto/create-notice.dto';
// import { UpdateNoticeDto } from './dto/update-notice.dto';

@Injectable()
export class NoticesService extends BaseService {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.articleCategory);
  }
}
