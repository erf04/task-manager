import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { ProjectsController } from './projects.controller';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[
      TypeOrmModule.forFeature([Project]),
      UserModule,
      AuthModule
  ],
  providers: [
    ProjectsService,
  ],
  controllers: [ProjectsController]
})
export class ProjectsModule {}
