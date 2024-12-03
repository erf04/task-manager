import { Test, TestingModule } from '@nestjs/testing';
import { AssignService } from './assign.service';

describe('AssignService', () => {
  let service: AssignService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssignService],
    }).compile();

    service = module.get<AssignService>(AssignService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
