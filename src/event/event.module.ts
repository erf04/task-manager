import { Module } from '@nestjs/common';
import { EventGateway } from './event.gateway';
import { UserModule } from 'src/user/user.module';
import { EventService } from './event.service';
import { UserService } from 'src/user/user.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [UserModule,AuthModule],
    controllers: [],
    providers: [EventGateway, EventService],
    exports: [EventService,EventGateway],
})
export class EventModule {}
