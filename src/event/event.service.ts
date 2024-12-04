import { Injectable } from '@nestjs/common';
import { UserDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';
import {Server, Socket } from 'socket.io';
import { AssignDto } from 'src/assign/dto/assign.dto';
import { EventGateway } from './event.gateway';
import { User } from 'src/user/user.entity';

@Injectable()
export class EventService {

  constructor(
    private readonly userService:UserService,

  ) {}


    async getUser(userId:number): Promise<UserDto> {
        return this.userService.findOne(userId);
    }



  async sendAssignmentNotification(server:Server,assign:AssignDto){
    // send notification to assigned user, manager and users from the project
    const assignedUserId = assign.user.userId;
    const assignProjectId = assign.task.project.id;
    server.to(`user_${assignedUserId}`).emit('gotAssignment',assign);
    server.to(`project_${assignProjectId}`).emit('assignToMember',assign);
    server.to(`manager_of_${assignProjectId}`).emit('assign',assign);
  }

  async joinToRooms(client:Socket,userId:number):Promise<User> {
    // join user to rooms
    client.join(`user_${userId}`);
    const user = await this.userService.findOne(userId);
    user.projectsAsManager.forEach(project =>{
      client.join(`project_${project.id}`);

    });
    user.projectsAsManager.forEach(project =>{
      client.join(`manager_of_${project.id}`);

    })
    return user;
}





}
