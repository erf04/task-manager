import { Module } from '@nestjs/common';
import { AssignService } from './assign.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assign } from './assign.entity';
import { TaskModule } from 'src/task/task.module';
import { UserModule } from 'src/user/user.module';
import { AssignController } from './assign.controller';
import { AuthModule } from 'src/auth/auth.module';
import { IsProjectManagerConstraint } from './validation/is-project-manager';
import { EventModule } from 'src/event/event.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([Assign]),
    TaskModule,
    UserModule,
    AuthModule,
    EventModule

  ],
  providers: [AssignService],
  controllers: [AssignController],
  exports:[AssignService],
  
})
export class AssignModule {}
