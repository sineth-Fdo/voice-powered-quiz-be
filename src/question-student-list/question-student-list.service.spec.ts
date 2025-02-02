import { Test, TestingModule } from '@nestjs/testing';
import { QuestionStudentListService } from './question-student-list.service';

describe('QuestionStudentListService', () => {
  let service: QuestionStudentListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuestionStudentListService],
    }).compile();

    service = module.get<QuestionStudentListService>(QuestionStudentListService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
