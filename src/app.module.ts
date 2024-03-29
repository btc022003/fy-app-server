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
import { RoomDevicesModule as AdminRoomDevicesModule } from './api/v1/admin/room-devices/room-devices.module';
import { ManagersModule } from './api/v1/admin/managers/managers.module';
import { HouseRoomsModule as AdminHouseRoomsModule } from './api/v1/admin/house-rooms/house-rooms.module';
import { LandLordsModule as AdminLandLordsModule } from './api/v1/admin/land-lords/land-lords.module';
import { CustomersModule as AdminCustomersModule } from './api/v1/admin/customers/customers.module';
import { HouseRoomsModule } from './api/v1/house-rooms/house-rooms.module';
import { ArticleCategoriesModule as AdminArticleCategoriesModule } from './api/v1/admin/article-categories/article-categories.module';
import { ArticlesModule as AdminArticlesModule } from './api/v1/admin/articles/articles.module';
import { NoticesModule as AdminNoticesModule } from './api/v1/admin/notices/notices.module';
import { BannerCategoriesModule as AdminBannerCategoriesModule } from './api/v1/admin/banner-categories/banner-categories.module';
import { BannersModule as AdminBannersModule } from './api/v1/admin/banners/banners.module';
import { AlipayController } from './pay/alipay/alipay.controller';

@Module({
  imports: [
    ChatMessageModule,
    AuthModule,
    SystemModule,

    LandLordsModule,

    MembersModule,
    CustomerModule,

    HouseRoomsModule,
    AdminRoomDevicesModule,
    AdminCustomersModule,
    ManagersModule,
    AdminLandLordsModule,
    AdminHouseRoomsModule,
    AdminArticleCategoriesModule,
    AdminArticlesModule,
    AdminNoticesModule,
    AdminBannerCategoriesModule,
    AdminBannersModule,
  ],
  controllers: [AppController, CommonController, AlipayController],
  providers: [AppService, PrismaService, CommonService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidateLoginMiddleware)
      .forRoutes(
        ...['/api/v1/admin/*', '/api/v1/members/*', '/api/v1/land_lords/*'],
      ); // 使用中间件
  }
}
