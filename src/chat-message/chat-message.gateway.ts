import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatMessageService } from './chat-message.service';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { UpdateChatMessageDto } from './dto/update-chat-message.dto';

@WebSocketGateway({ cors: true })
export class ChatMessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private static allClients = new Map(); // 设置所有在线的客户端列表 { t: '类型', id: '' }

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatMessageService: ChatMessageService,
    private readonly prisma: PrismaService,
  ) {}

  // 客户端连接
  async handleConnection(socket: Socket) {
    const socketId = socket.id;
    // console.log(`New connecting... socket id:`, socketId);
    // console.log(socket.handshake.query);
    ChatMessageGateway.allClients.set(socketId, {
      type: socket.handshake.query.t, // 类型, user/landLord
      id: socket.handshake.query.id, // id
    });
    // ChatWebsocketGateway.participants.set(socketId, '');

    // 根据当前用户的分类信息获取聊天30条历史记录
    const { type, id } = socket.handshake.query;
    const where: any = {};
    if (type === 'user') {
      where.userId = id;
    } else {
      where.landLordId = id;
    }

    const messages = await this.prisma.message.findMany({
      where: where,
      orderBy: {
        createdAt: 'desc',
      },
      take: 30,
    });

    socket?.emit('allMessage', messages);
  }

  // 客户端断开连接
  handleDisconnect(socket: Socket): void {
    const socketId = socket.id;
    // console.log(`Disconnection... socket id:`, socketId);

    ChatMessageGateway.allClients.delete(socketId); // 从在线列表中删除客户端信息
  }

  // 客户端发送消息，这里接受
  // 客户端通过receive监听新消息
  @SubscribeMessage('send')
  async create(@MessageBody() createChatMessageDto: CreateChatMessageDto) {
    // console.log(createChatMessageDto);
    const data = await this.prisma.message.create({
      data: createChatMessageDto,
    });
    let to = '';
    if (createChatMessageDto.isFromUser) {
      to = createChatMessageDto.landLordId;
    } else {
      to = createChatMessageDto.userId;
    }
    let toSocketId = ''; // 需要接收消息的客户端的id
    const clients = await this.server.fetchSockets(); // 所有连接的客户端
    ChatMessageGateway.allClients.forEach((dItem, dKey) => {
      if (dItem.id == to) {
        //
        toSocketId = dKey;
      }
    });
    const client = clients.find((item) => item.id == toSocketId); // 接收消息的客户端信息
    // 发送全部聊天记录到客户端，后期可以优化
    const msgs = await this.prisma.message.findMany({
      where: {
        userId: data.userId,
        landLordId: data.landLordId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
    client?.emit('receive', msgs); // 发送消息到接收者

    return { code: 1, data: msgs };
  }
}
