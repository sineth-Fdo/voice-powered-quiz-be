import { Test, TestingModule } from '@nestjs/testing';
import { QuizStudentController } from './quiz-student.controller';
import { QuizStudentService } from './quiz-student.service';

describe('QuizStudentController', () => {
  let controller: QuizStudentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuizStudentController],
      providers: [QuizStudentService],
    }).compile();

    controller = module.get<QuizStudentController>(QuizStudentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
