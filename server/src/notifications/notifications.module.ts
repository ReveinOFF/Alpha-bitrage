import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './notifications.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationModule {}
