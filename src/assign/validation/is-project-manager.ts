import { Injectable, Scope } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { AssignService } from '../assign.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Assign } from '../assign.entity';
import { Repository } from 'typeorm';



@ValidatorConstraint({ name: 'IsProjectManager', async: true })
@Injectable({scope:Scope.TRANSIENT})
export class IsProjectManagerConstraint implements ValidatorConstraintInterface {
    constructor(
        private assignService:AssignService) {}

    async validate(assignId: number, args: ValidationArguments): Promise<boolean> {
        
        const userId = args.object['userId']; // Extract `userId` from the validation object
        const assign = await this.assignService.findOne(assignId);
        return assign.task.project.manager.userId === userId;
    }

    defaultMessage(args: ValidationArguments): string {
        return `User is not the manager of the project of this task with ID ${args.value}`;
    }
}
