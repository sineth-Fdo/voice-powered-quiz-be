import { Test, TestingModule } from '@nestjs/testing';
import { QuestionStudentListController } from './question-student-list.controller';
import { QuestionStudentListService } from './question-student-list.service';

describe('QuestionStudentListController', () => {
  let controller: QuestionStudentListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionStudentListController],
      providers: [QuestionStudentListService],
    }).compile();

    controller = module.get<QuestionStudentListController>(QuestionStudentListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
