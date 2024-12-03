import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';
import { TaskDto } from './dto/task.dto';

@Injectable()
export class TransformTaskInterceptor implements NestInterceptor {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<any> {
        return next.handle().pipe(
            map((data) => {
                // Transform the Task entity to UserDto
                return plainToInstance(TaskDto, data, {
                    excludeExtraneousValues: true, // Ensures only properties with `@Expose` are included
                });
            }),
        );
    }
}
