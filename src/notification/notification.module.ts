import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventNotif } from './notification.entity';

@Module({
  imports:[TypeOrmModule.forFeature([EventNotif])],
  providers: [NotificationService]
})
export class NotificationModule {}
