import { Body, Controller, Post } from '@nestjs/common';
import { CreateQuestionStudentListDto } from './dto/create-question-student-list.dto';
import { QuestionStudentListService } from './question-student-list.service';

@Controller('question-student-list')
export class QuestionStudentListController {
  constructor(private readonly questionStudentListService: QuestionStudentListService) {}

  @Post('create')
  create(
    @Body() CreateQuestionStudentListDto: CreateQuestionStudentListDto
  ){
    return this.questionStudentListService.create(CreateQuestionStudentListDto);
  }


}
