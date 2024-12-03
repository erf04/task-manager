import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ProjectsModule } from 'src/projects/projects.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    AuthModule,
    ProjectsModule
  ],
  controllers: [TaskController],
  providers: [TaskService],
  exports:[TaskService]
})
export class TaskModule {}
