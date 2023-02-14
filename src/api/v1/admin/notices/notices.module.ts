import { Module } from '@nestjs/common';
import { NoticesService } from './notices.service';
import { NoticesController } from './notices.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [NoticesController],
  providers: [NoticesService, PrismaService],
})
export class NoticesModule {}
