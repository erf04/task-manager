import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance, ClassConstructor } from 'class-transformer';

@Injectable()
export class TransformDtoInterceptor<T> implements NestInterceptor {
    constructor(private readonly dto: ClassConstructor<T>) {}

    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<any> {
        return next.handle().pipe(
            map((data) => {
                if (Array.isArray(data)) {
                    // Transform an array of entities
                    return data.map((item) =>
                        plainToInstance(this.dto, item, {
                            excludeExtraneousValues: true,
                        }),
                    );
                } else {
                    // Transform a single entity
                    return plainToInstance(this.dto, data, {
                        excludeExtraneousValues: true,
                    });
                }
            }),
        );
    }
}
