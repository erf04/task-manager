import { Injectable } from '@nestjs/common';
import { UserDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';
import {Server, Socket } from 'socket.io';
import { AssignDto } from 'src/assign/dto/assign.dto';
import { EventGateway } from './event.gateway';
import { User } from 'src/user/user.entity';
import { EventType } from './constants';

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
    server.to(`user_${assignedUserId}`).emit(EventType.GOT_ASSIGNMENT,assign);
    server.to(`project_${assignProjectId}`).emit(EventType.ASSIGN_TO_A_MEMBER,assign);
    server.to(`manager_of_${assignProjectId}`).emit(EventType.ASSIGN_TASK,assign);
  }

  async sendUpdateTaskNotification(server:Server,assign:AssignDto){
    // send notification to assigned user, manager and users from the project
    const assignedUserId = assign.user.userId;
    const assignProjectId = assign.task.project.id;
    server.to(`user_${assignedUserId}`).emit(EventType.UPDATE_ASSIGNED_TASK,assign);
    server.to(`project_${assignProjectId}`).emit(EventType.UPDATE_TASK,assign);
    server.to(`manager_of_${assignProjectId}`).emit(EventType.MANAGER_UPDATE_TASK,assign);
  }

  async sendChangeAssigneeNotification(server:Server,assign:AssignDto){
    // send notification to assigned user, manager and users from the project
    const assignedUserId = assign.user.userId;
    const assignProjectId = assign.task.project.id;
    server.to(`user_${assignedUserId}`).emit(EventType.CHANGE_ASSIGNEE,assign);
    server.to(`project_${assignProjectId}`).emit(EventType.CHANGE_ASSIGNEE_MEMBERS,assign);
    server.to(`manager_of_${assignProjectId}`).emit(EventType.CHANGE_ASSIGNEE_MANGER,assign);
  }

  async joinToRooms(client:Socket,user:UserDto):Promise<void> {
    // join user to rooms
    client.join(`user_${user.userId}`);
    // const user = await this.userService.findOne(userId);
    user.projectsAsManager.forEach(project =>{
      client.join(`project_${project.id}`);

    });
    user.projectsAsManager.forEach(project =>{
      client.join(`manager_of_${project.id}`);

    })
}





}
