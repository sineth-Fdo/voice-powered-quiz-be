import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { QuestionService } from './question.service';
import { CheckAnswerDto } from './dto/check-answer.dto';

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

  @Patch('check-answer')
  checkAnswer(@Body() checkAnswerDto: CheckAnswerDto) {
    return this.questionService.checkAnswer(checkAnswerDto);
  }

  @Get('find/:quizId')
  find(
    @Param('quizId') quizId: string,
    @Query('questionNumber') questionNumber: number,

) {
    return this.questionService.find(quizId, questionNumber);
  }

}
