import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './project.entity';

@Module({
  imports:[
      TypeOrmModule.forFeature([Project])
  ],
  providers: [
    ProjectsService,
  ]
})
export class ProjectsModule {}
