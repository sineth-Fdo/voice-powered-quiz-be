import { Body, Controller, Delete, Post } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { QuestionService } from './question.service';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post('create')
  create(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionService.create(createQuestionDto);
  }

  @Delete('delete')
  delete(@Body() quizId: string) {
    return this.questionService.deleteAllQuestionsAndStudentList(quizId);
  }


}
