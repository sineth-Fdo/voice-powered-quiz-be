import { Test, TestingModule } from '@nestjs/testing';
import { QuizStudentService } from './quiz-student.service';

describe('QuizStudentService', () => {
  let service: QuizStudentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuizStudentService],
    }).compile();

    service = module.get<QuizStudentService>(QuizStudentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
