import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles/roles.guard';
import { ProjectsModule } from './projects/projects.module';
import { TaskModule } from './task/task.module';

@Module({
  
  imports:
  [
    // ConfigModule.forRoot({
    //   envFilePath:".env.app",
    //   isGlobal:true
    // }),
    TypeOrmModule.forRootAsync({
      // imports:[ConfigModule],
      // inject:[ConfigService],
      // useFactory:(configService:ConfigService)=>({
      //   type:"mysql",
      //   host : configService.get<string>("HOST","localhost"), 
      //   port : configService.get<number>("PORT",3306),
      //   username : configService.get<string>("DB_USERNAME","root"),
      //   password : configService.get<string>("DB_PASSWORD","erfank2004"),
      //   database : configService.get<string>("DB_NAME","task_manager"),
      //   autoLoadEntities:true,
      //   synchronize:true
      // })
      useFactory:()=>({
        type:"mysql",
        host : "localhost", 
        port :3307,
        username : "root",
        password : "1234",
        database : "task_manager",
        autoLoadEntities:true,
        synchronize:true
      })
    }),
    AuthModule,
    ProjectsModule,
    TaskModule,
  
    
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule {}
