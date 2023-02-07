import { Module } from '@nestjs/common';
import { ChatMessageService } from './chat-message.service';
import { ChatMessageGateway } from './chat-message.gateway';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [ChatMessageGateway, ChatMessageService, PrismaService],
})
export class ChatMessageModule {}
