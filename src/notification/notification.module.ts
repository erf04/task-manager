import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventNotif } from './notification.entity';
import { NotificationController } from './notification.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[TypeOrmModule.forFeature([EventNotif]),AuthModule],
  providers: [NotificationService],
  exports:[NotificationService],
  controllers: [NotificationController]
})
export class NotificationModule {}
