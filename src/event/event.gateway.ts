import { Injectable, Logger } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserService } from './../user/user.service';
import { EventService } from './event.service';
import { UserDto } from 'src/user/dto/user.dto';
import { AssignDto } from 'src/assign/dto/assign.dto';


@WebSocketGateway()
@Injectable()
export class EventGateway implements OnGatewayConnection,OnGatewayDisconnect,OnGatewayInit{

  private readonly logger = new Logger(EventGateway.name);

  @WebSocketServer() server: Server;

  constructor(private readonly eventService:EventService){}


  afterInit(server: any) {
    this.logger.log('Initilized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    const {sockets} = this.server.sockets;
    this.logger.verbose(`client id ${client.id} Connected`);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.warn(`client id ${client.id} Disconnected`);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): string {
    return 'Hello world!';
  }

  @SubscribeMessage('join')   
  async handleJoin(@ConnectedSocket() client: Socket,@MessageBody() payload: {userId:number}): Promise<string> {
    const user = await this.eventService.joinToRooms(client,payload.userId);
    client.data.user = user;
    this.logger.debug(`client id ${client.id} joined room ${payload.userId} `);
    return `user ${user.username} joined room ${payload.userId}`;
  }

  @SubscribeMessage('leave')
  async handleLeave(@ConnectedSocket() client: Socket,@MessageBody() payload: {userId:number}): Promise<string> {
    client.leave(`user_${payload.userId}`);
    this.logger.debug(`client id ${client.id} left room ${payload.userId}`);
    return `user left room ${payload.userId}`;
  }


  async sendAssignmentNotification(assign:AssignDto){
    await this.eventService.sendAssignmentNotification(this.server,assign);
    this.logger.debug(`assignment notification sent`);
  }
  


  


}
