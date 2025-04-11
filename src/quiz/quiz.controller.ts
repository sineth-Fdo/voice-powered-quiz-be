import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { UpdateTotalsDto } from './dto/update-totals.dto';
import { QuizService } from './quiz.service';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post('create') 
  create(@Body() createQuizDto: CreateQuizDto) {
    return this.quizService.create(createQuizDto);
  }

  @Delete('delete/:quizId')
  delete(
    @Param('quizId') quizId: string,
  ) {
    return this.quizService.delete(quizId);
  }

  @Patch('update-totals/:quizId')
  update(
    @Param('quizId') quizId: string,
    @Body() UpdateTotalsDto: UpdateTotalsDto,
  ) {
    return this.quizService.updateTotals(quizId, UpdateTotalsDto);
  }

  @Patch('update-status/:quizId')
  updateStatus(
    @Param('quizId') quizId: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return this.quizService.updateStatus(quizId, updateStatusDto);
  }

  // findAll quizes as a query
  @Get('all')
  findAll(
    @Query('subject') subject: string,
    @Query('teacher') teacher: string,
    @Query('batch') batch: string,
    @Query('grade') grade: string,
    @Query('status') status: string,
  ) {
    return this.quizService.findAll(
      subject, teacher, batch, grade, status
    );
  }

  // Find a quiz by id
  @Get('find/:quizId')
  findOne(
    @Param('quizId') quizId: string,
  ) {
    return this.quizService.findOne(quizId);
  }

  @Put('update/:quizId')
  updateQuiz(
    @Param('quizId') quizId: string,
    @Body() updateQuizDto: UpdateQuizDto,
  ) {
    return this.quizService.updateQuiz(quizId, updateQuizDto);
  }
}
