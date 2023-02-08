import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonController } from './api/v1/common/common.controller';
import { ValidateLoginMiddleware } from './validate-login/validate-login.middleware';
import { PrismaService } from './prisma/prisma.service';
import { ChatMessageModule } from './chat-message/chat-message.module';
import { AuthModule } from './api/v1/auth/auth.module';
import { MembersModule } from './api/v1/members/members.module';
import { CommonService } from './api/v1/common/common.service';
import { LandLordsModule } from './api/v1/land-lords/land-lords.module';
import { CustomerModule } from './api/v1/customer/customer.module';
import { SystemModule } from './api/v1/system/system.module';
import { RoomDevicesModule } from './api/v1/admin/room-devices/room-devices.module';

@Module({
  imports: [
    ChatMessageModule,
    AuthModule,
    MembersModule,
    LandLordsModule,
    CustomerModule,
    SystemModule,
    RoomDevicesModule,
  ],
  controllers: [AppController, CommonController],
  providers: [AppService, PrismaService, CommonService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidateLoginMiddleware)
      .forRoutes(...['/api/v1/admin/*', '/api/v1/members/*']); // 使用中间件
  }
}
